import User from "../models/userModel.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ name: 1 }); // 1 for ascending order
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Add an user
// @route   POST /api/users/add
// @access  Private
const addUser = async (req, res) => {
  const { username, firstName, lastName, email, password, isAdmin } = req.body;
  const user = new User({
    username: username,
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    isAdmin: isAdmin,
  });

  await user.save();
  res.status(200).json({ message: "User added successfully" });
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc    Update user by ID
// @route   PUT /api/users/:id
// @access  Private
const updateUserById = async (req, res) => {
  const { username, firstName, lastName, email, password, isAdmin } = req.body;

  const user = await User.findById(req.params.id);

  if (user) {
    user.username = username !== undefined ? username : user.username;
    user.firstName = firstName !== undefined ? firstName : user.firstName;
    user.lastName = lastName !== undefined ? lastName : user.lastName;
    user.email = email !== undefined ? email : user.email;
    user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc    Delete user by ID
// @route   DELETE /api/users/:id
// @access  Private
const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ message: "User removed successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Search user by name
// @route   GET /api/users/search/:name
// @access  Private
const searchUserByName = async (req, res) => {
  try {
    const { name } = req.params;
    const users = await User.find({
      firstName: { $regex: name, $options: "i" },
    });
    res.json(users);
  } catch (error) {
    console.error("Error searching users by name:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export {
  getAllUsers,
  addUser,
  getUserById,
  updateUserById,
  deleteUserById,
  searchUserByName,
};
