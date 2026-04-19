const ScanResult = require('../models/ScanResult');
const User = require('../models/User');
const urlAnalyzer = require('../services/urlAnalyzer');

// @desc    Scan a URL
// @route   POST /api/scan
exports.scanUrl = async (req, res) => {
  try {
    let { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid URL'
      });
    }

    url = url.trim();

    // Add protocol if missing
    if (!url.match(/^https?:\/\//i)) {
      url = 'http://' + url;
    }

    // Run analysis
    const analysis = urlAnalyzer.analyze(url);

    // Save to database
    const scanResult = await ScanResult.create({
      userId: req.user._id,
      url: analysis.url,
      normalizedUrl: analysis.normalizedUrl,
      riskScore: analysis.riskScore,
      riskLevel: analysis.riskLevel,
      threats: analysis.threats,
      details: analysis.details,
      isFlagged: analysis.riskLevel === 'dangerous'
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        totalScans: 1,
        threatsFound: analysis.riskLevel !== 'safe' ? 1 : 0
      }
    });

    // Emit real-time alert if dangerous
    if (analysis.riskLevel === 'dangerous' && req.io) {
      req.io.to(req.user._id.toString()).emit('threat-alert', {
        url: analysis.url,
        riskScore: analysis.riskScore,
        riskLevel: analysis.riskLevel,
        threats: analysis.threats.length,
        scanId: scanResult._id
      });
    }

    res.json({
      success: true,
      scan: {
        id: scanResult._id,
        url: scanResult.url,
        riskScore: scanResult.riskScore,
        riskLevel: scanResult.riskLevel,
        threats: scanResult.threats,
        details: scanResult.details,
        scannedAt: scanResult.createdAt
      }
    });
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error scanning URL'
    });
  }
};

// @desc    Get scan by ID
// @route   GET /api/scan/:id
exports.getScan = async (req, res) => {
  try {
    const scan = await ScanResult.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found'
      });
    }

    res.json({
      success: true,
      scan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching scan'
    });
  }
};
