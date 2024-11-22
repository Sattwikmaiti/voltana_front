import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null); // User being edited
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [selectedRole, setSelectedRole] = useState(""); // State for selected filter

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://voltana.onrender.com/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open the edit form with user data
  const handleEdit = (user) => {
    setEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  // Handle form submission for updating user
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://voltana.onrender.com/api/users/${editUser.id}`,
        formData
      );
      alert("User updated successfully!");
      setEditUser(null); // Close the edit form
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error(error);
      alert("Error updating user!");
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setEditUser(null);
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle role filter change
  const handleRoleFilterChange = (e) => {
    setSelectedRole(e.target.value);
    console.log("Target",e.target.value);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered users based on search term and role
  const filteredUsers = users.filter((user) => {
    console.log("user",user.role.toLowerCase());
    console.log("Role",selectedRole);
    const searchMatch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) 
      
     
    const roleMatch = selectedRole ? user.role === selectedRole.toLowerCase() : true;

    return searchMatch && roleMatch;
  });

  return (
    <div className="container dashboard">
      
      <h2 style={{padding:'10px'}}>User Dashboard</h2>

      {/* Search and Filter Section */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, email, or role"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="mt-2">
          <select
            className="form-select"
            value={selectedRole}
            onChange={handleRoleFilterChange}
          >
            <option value="">Filter by Role</option>
            <option value="Admin">admin</option>
            <option value="User">user</option>
            <option value="Manager">manager</option>
            {/* Add more roles if needed */}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </button><button
  className="btn btn-danger"
  onClick={async () => {
    // Ask for confirmation before deleting
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${user.name} with email ${user.email}?`
    );

    if (confirmDelete) {
      try {
        // Proceed with delete if user confirmed
        await axios.delete(`https://voltana.onrender.com/api/users/${user.id}`);
        alert("User deleted successfully!");
        fetchUsers(); // Refresh the user list
      } catch (error) {
        console.error(error);
        alert("Error deleting user!");
      }
    }
  }}
>
  Delete
</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit User Form */}
      {editUser && (
        <div className="mt-4">
          <h3>Edit User</h3>
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Role</label>
              <input
                type="text"
                className="form-control"
                name="role"
                value={formData.role}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-success me-2">
              Save
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
