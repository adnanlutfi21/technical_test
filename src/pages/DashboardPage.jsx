// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import UserCard from "../components/user/UserCard";
import UserModal from "../components/user/UserModal";

const DashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");

  const [modalFormError, setModalFormError] = useState("");

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const showTemporaryNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage("");
    }, 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/users?page=2");
      setUsers(response.data.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Gagal memuat data pengguna. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUserClick = () => {
    setEditingUser(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setAvatar("");
    setModalFormError("");
    setIsModalOpen(true);
  };

  const handleEditUserClick = (user) => {
    setEditingUser(user);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
    setAvatar(user.avatar || "");
    setModalFormError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setModalFormError("");
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setModalFormError("");

    if (!firstName || !lastName || !email) {
      setModalFormError(
        "Nama depan, nama belakang, dan email tidak boleh kosong."
      );
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setModalFormError("Format email tidak valid.");
      return;
    }

    setLoading(true);
    setError(null);

    const userData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      avatar:
        avatar ||
        `https://i.pravatar.cc/150?u=${Math.floor(Math.random() * 1000) + 1}`,
    };

    try {
      if (editingUser) {
        const response = await apiClient.put(
          `/users/${editingUser.id}`,
          userData
        );
        console.log("User updated:", response.data);

        setUsers(
          users.map((user) =>
            user.id === editingUser.id ? { ...user, ...userData } : user
          )
        );
        showTemporaryNotification("Pengguna berhasil diperbarui!");
      } else {
        const response = await apiClient.post("/users", userData);
        console.log("User created:", response.data);
        const newUser = {
          id: response.data.id,
          ...userData,
        };
        setUsers([newUser, ...users]);
        showTemporaryNotification("Pengguna berhasil ditambahkan!");
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error saving user:", err);
      setError("Gagal menyimpan pengguna. Silakan coba lagi.");
      setModalFormError("Gagal menyimpan pengguna. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/users/${userToDelete}`);
      console.log("User deleted:", userToDelete);
      setUsers(users.filter((user) => user.id !== userToDelete));
      showTemporaryNotification("Pengguna berhasil dihapus!");
      setIsConfirmModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Gagal menghapus pengguna. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsConfirmModalOpen(false);
    setUserToDelete(null);
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <svg
          className="animate-spin h-12 w-12 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-lg text-gray-700 ml-3">Memuat pengguna...</p>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <p className="text-lg text-red-500">{error}</p>
        <button
          onClick={fetchUsers}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-24 relative">
      {showNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ease-out transform scale-100 opacity-100">
          <p className="font-semibold">{notificationMessage}</p>
        </div>
      )}

      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Daftar Pengguna</h1>
          <button
            onClick={handleAddUserClick}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md text-lg font-semibold transition duration-200 ease-in-out flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Tambah Pengguna
          </button>
        </div>

        {error && users.length > 0 && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.103l-2.651 3.746a1.2 1.2 0 0 1-1.697-1.697l3.746-2.651-3.746-2.651a1.2 1.2 0 0 1 1.697-1.697L10 8.897l2.651-3.746a1.2 1.2 0 0 1 1.697 1.697L11.103 10l3.746 2.651a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        )}

        {users.length === 0 && !loading && !error ? (
          <p className="text-center text-lg text-gray-600">
            Tidak ada pengguna ditemukan.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={handleEditUserClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Depan
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Belakang
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700"
            >
              URL Gambar Avatar (Opsional)
            </label>
            <input
              type="url"
              id="avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="Contoh: https://example.com/avatar.jpg"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {avatar && (
              <div className="mt-2 text-center">
                <p className="text-sm text-gray-600 mb-1">Preview:</p>
                <img
                  src={avatar}
                  alt="Avatar Preview"
                  className="w-20 h-20 rounded-full mx-auto border-2 border-gray-300 object-cover"
                />
              </div>
            )}
          </div>

          {modalFormError && (
            <p className="text-red-500 text-sm">{modalFormError}</p>
          )}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </UserModal>

      <UserModal
        isOpen={isConfirmModalOpen}
        onClose={cancelDelete}
        title="Konfirmasi Penghapusan"
      >
        <div className="text-center p-4">
          <p className="text-lg text-gray-700 mb-6">
            Apakah Anda yakin ingin menghapus pengguna ini?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={cancelDelete}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition duration-200"
            >
              Batal
            </button>
            <button
              onClick={confirmDelete}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
              disabled={loading}
            >
              {loading ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </div>
      </UserModal>
    </div>
  );
};

export default DashboardPage;
