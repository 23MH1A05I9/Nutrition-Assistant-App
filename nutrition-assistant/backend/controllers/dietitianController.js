import Dietitian from '../models/Dietitian.js';
import User from '../models/User.js';

const dietitianPopulate = [
  { path: 'userId', select: 'name email phone role' },
  { path: 'clients', select: 'name email age bmi phone' }
];

// Get all dietitians
export const getDietitians = async (req, res) => {
  try {
    const dietitians = await Dietitian.find()
      .populate('userId', 'name email phone')
      .populate('clients', 'name email');
    
    // Format response
    const formattedDietitians = dietitians.map(d => ({
      _id: d._id,
      name: d.userId?.name || 'Unknown',
      email: d.userId?.email || '',
      phone: d.userId?.phone || '',
      qualification: d.qualification,
      specialization: d.specialization,
      experience: d.experience,
      rating: d.rating,
      clients: d.clients?.length || 0,
      isApproved: d.isApproved,
      availability: d.availability,
      userId: d.userId?._id
    }));
    
    res.json(formattedDietitians);
  } catch (error) {
    console.error('Error fetching dietitians:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get the currently authenticated dietitian profile
export const getMyDietitianProfile = async (req, res) => {
  try {
    const dietitian = await Dietitian.findOne({ userId: req.userId });

    if (!dietitian) {
      return res.status(404).json({ message: 'Dietitian profile not found' });
    }

    await dietitian.populate(dietitianPopulate);
    res.json(dietitian);
  } catch (error) {
    console.error('Error fetching current dietitian profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single dietitian by ID
export const getDietitianById = async (req, res) => {
  try {
    const dietitian = await Dietitian.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('clients', 'name email age bmi');
    
    if (!dietitian) {
      return res.status(404).json({ message: 'Dietitian not found' });
    }
    
    res.json(dietitian);
  } catch (error) {
    console.error('Error fetching dietitian:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create dietitian profile
export const createDietitian = async (req, res) => {
  try {
    const { qualification, specialization, experience, availability } = req.body;
    
    // Check if user already has a dietitian profile
    const existing = await Dietitian.findOne({ userId: req.userId });
    if (existing) {
      return res.status(400).json({ message: 'Dietitian profile already exists' });
    }
    
    const dietitian = new Dietitian({
      userId: req.userId,
      qualification,
      specialization,
      experience,
      availability: availability || [],
      isApproved: false
    });
    
    await dietitian.save();
    
    // Update user role if not already dietitian
    await User.findByIdAndUpdate(req.userId, { role: 'dietitian' });
    
    res.status(201).json(dietitian);
  } catch (error) {
    console.error('Error creating dietitian:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update dietitian profile
export const updateDietitian = async (req, res) => {
  try {
    const { qualification, specialization, experience, availability } = req.body;
    
    const dietitian = await Dietitian.findOne({ userId: req.userId });
    if (!dietitian) {
      return res.status(404).json({ message: 'Dietitian profile not found' });
    }
    
    // Check if user is admin or the dietitian themselves
    if (req.userRole !== 'admin' && dietitian.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    dietitian.qualification = qualification || dietitian.qualification;
    dietitian.specialization = specialization || dietitian.specialization;
    dietitian.experience = experience || dietitian.experience;
    dietitian.availability = availability || dietitian.availability;
    
    await dietitian.save();
    
    res.json(dietitian);
  } catch (error) {
    console.error('Error updating dietitian:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve dietitian (admin only)
export const approveDietitian = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const dietitian = await Dietitian.findById(req.params.id);
    if (!dietitian) {
      return res.status(404).json({ message: 'Dietitian not found' });
    }
    
    dietitian.isApproved = true;
    await dietitian.save();
    
    res.json({ message: 'Dietitian approved successfully', dietitian });
  } catch (error) {
    console.error('Error approving dietitian:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add client to dietitian
export const addClient = async (req, res) => {
  try {
    const clientId = req.body.clientId || req.params.clientId;

    if (!clientId) {
      return res.status(400).json({ message: 'Client ID is required' });
    }
    
    const dietitian = await Dietitian.findOne({ userId: req.userId });
    if (!dietitian) {
      return res.status(404).json({ message: 'Dietitian profile not found' });
    }
    
    if (!dietitian.clients.includes(clientId)) {
      dietitian.clients.push(clientId);
      await dietitian.save();
    }
    
    res.json({ message: 'Client added successfully', dietitian });
  } catch (error) {
    console.error('Error adding client:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove client from dietitian
export const removeClient = async (req, res) => {
  try {
    const clientId = req.body.clientId || req.params.clientId;

    if (!clientId) {
      return res.status(400).json({ message: 'Client ID is required' });
    }
    
    const dietitian = await Dietitian.findOne({ userId: req.userId });
    if (!dietitian) {
      return res.status(404).json({ message: 'Dietitian profile not found' });
    }
    
    dietitian.clients = dietitian.clients.filter(id => id.toString() !== clientId);
    await dietitian.save();
    
    res.json({ message: 'Client removed successfully', dietitian });
  } catch (error) {
    console.error('Error removing client:', error);
    res.status(500).json({ message: 'Server error' });
  }
};