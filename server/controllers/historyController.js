const ScanResult = require('../models/ScanResult');

// @desc    Get scan history for current user
// @route   GET /api/history
exports.getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = req.query.filter; // safe, suspicious, dangerous

    const query = { userId: req.user._id };
    if (filter && ['safe', 'suspicious', 'dangerous'].includes(filter)) {
      query.riskLevel = filter;
    }

    const [scans, total] = await Promise.all([
      ScanResult.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ScanResult.countDocuments(query)
    ]);

    res.json({
      success: true,
      scans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching scan history'
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/history/stats
exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [totalScans, riskBreakdown, recentScans, last7Days] = await Promise.all([
      ScanResult.countDocuments({ userId }),

      ScanResult.aggregate([
        { $match: { userId } },
        { $group: { _id: '$riskLevel', count: { $sum: 1 } } }
      ]),

      ScanResult.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      ScanResult.aggregate([
        {
          $match: {
            userId,
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 },
            threats: {
              $sum: {
                $cond: [{ $ne: ['$riskLevel', 'safe'] }, 1, 0]
              }
            }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    // Format risk breakdown
    const breakdown = { safe: 0, suspicious: 0, dangerous: 0 };
    riskBreakdown.forEach(r => {
      breakdown[r._id] = r.count;
    });

    res.json({
      success: true,
      stats: {
        totalScans,
        breakdown,
        threatRate: totalScans > 0
          ? Math.round(((breakdown.suspicious + breakdown.dangerous) / totalScans) * 100)
          : 0,
        recentScans,
        dailyActivity: last7Days
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats'
    });
  }
};

// @desc    Delete a scan record
// @route   DELETE /api/history/:id
exports.deleteScan = async (req, res) => {
  try {
    const scan = await ScanResult.findOneAndDelete({
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
      message: 'Scan deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting scan'
    });
  }
};
