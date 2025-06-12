import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Avatar } from '@mui/material';
import api from '../utils/axios';

const API_URL = process.env.REACT_APP_API_URL;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/api/users/me');
        setUser(res.data.data || res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    setAvatarUploading(true);
    try {
      await api.patch('/api/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Sau khi upload thành công, reload lại user
      const res = await api.get('/api/users/me');
      setUser(res.data.data || res.data);
    } catch (err) {
      // Có thể hiển thị thông báo lỗi ở đây
    } finally {
      setAvatarUploading(false);
    }
  };

  if (loading) return <Typography align="center" sx={{ mt: 5 }}>Đang tải thông tin...</Typography>;
  if (!user) return <Typography align="center" sx={{ mt: 5 }}>Không tìm thấy thông tin người dùng.</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>User Profile</Typography>
          <Typography variant="body2" color="text.secondary">Personal details and preferences.</Typography>
        </Box>
        <Button variant="contained">Edit Profile</Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2, mb: 2 }}>
        <label htmlFor="avatar-upload">
          <Avatar
            src={user.avatar ? (user.avatar.startsWith('/uploads/avatar/') ? `${API_URL}${user.avatar}` : `${API_URL}/uploads/avatar/${user.avatar}`) : undefined}
            sx={{ width: 100, height: 100, cursor: 'pointer', mb: 1 }}
          />
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
            disabled={avatarUploading}
          />
        </label>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          Nhấn vào hình để thay đổi avatar
        </Typography>
      </Box>
      <Box sx={{ bgcolor: '#f9f9f9', borderRadius: 1, p: 2 }}>
        <Box sx={{ display: 'flex', py: 1 }}>
          <Box sx={{ width: 140, color: 'text.secondary' }}>Full name</Box>
          <Box sx={{ fontWeight: 500 }}>{user.name}</Box>
        </Box>
        <Box sx={{ display: 'flex', py: 1 }}>
          <Box sx={{ width: 140, color: 'text.secondary' }}>Email address</Box>
          <Box>{user.email}</Box>
        </Box>
        <Box sx={{ display: 'flex', py: 1 }}>
          <Box sx={{ width: 140, color: 'text.secondary' }}>Phone number</Box>
          <Box>{user.phoneNumber || '-'}</Box>
        </Box>
        <Box sx={{ display: 'flex', py: 1 }}>
          <Box sx={{ width: 140, color: 'text.secondary' }}>Role</Box>
          <Box>
            <span style={{
              background: '#1976d2',
              color: 'white',
              borderRadius: 8,
              padding: '2px 10px',
              fontSize: 13,
              fontWeight: 500
            }}>{user.role}</span>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', py: 1 }}>
          <Box sx={{ width: 140, color: 'text.secondary' }}>Member since</Box>
          <Box>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile; 