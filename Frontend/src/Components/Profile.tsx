import { useQuery, useMutation } from '@apollo/client/react';
import { useState } from 'react';
import { GET_ME } from '../graphql/queries';
import { UPDATE_AVATAR } from '../graphql/mutations';
import './Results.css';
import { downloadProfileForm } from '../utils/generateProfileForm';
import type { GetMeResponse } from '../types';

export function AvatarUploader({ currentAvatar, initials }: { currentAvatar?: string; initials: string }) {
  const [uploading, setUploading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const [updateAvatar] = useMutation(UPDATE_AVATAR, {
    refetchQueries: [{ query: GET_ME }]
  });

  const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) { 
      alert('Select a passport photo under 1MB.');
      e.target.value = '';
      return;
    }
    if (!cloudName || !uploadPreset) {
      console.log('Cloudinary environment variables missing in .env');
      return;
    }

    setUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', uploadPreset);
      data.append('cloud_name', cloudName);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: data
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Upload failed');

      await updateAvatar({ variables: { avatarUrl: json.secure_url } });
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', margin: '-50px 0 1rem 2rem' }}>
      <label 
        htmlFor="avatar-upload"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '110px',
          height: '110px',
          borderRadius: '50%',
          border: '4px solid white',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          cursor: uploading ? 'wait' : 'pointer',
          overflow: 'hidden',
          backgroundColor: '#2b3674',
          userSelect: 'none'
        }}
      >
        {/* Render Image or Initials */}
        {currentAvatar && !currentAvatar.includes('default-avatar') ? (
          <img 
            src={currentAvatar} 
            alt="Student Passport" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          <span style={{ color: 'white', fontSize: '2rem', fontWeight: 700 }}>
            {initials}
          </span>
        )}

        {/* Hover / Loading Overlay */}
        {(isHovered || uploading) && (
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.55)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 600,
              gap: '4px',
              transition: 'opacity 0.2s ease'
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>{uploading ? '⏳' : ''}</span>
            <span>{uploading ? 'Uploading...' : 'Update'}</span>
          </div>
        )}
      </label>

      <input 
        id="avatar-upload" 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        disabled={uploading} 
        style={{ display: 'none' }} 
      />
    </div>
  );
}

export default function Profile() {
  const { data, loading, error } = useQuery<GetMeResponse>(GET_ME);

  if (loading) return <div className="page-wrapper"><div className="page-header"><h2>Loading Profile...</h2></div></div>;
  if (error) return <div className="page-wrapper"><div className="page-header"><h2 style={{ color: 'red' }}>Failed to load profile</h2></div></div>;

  const user = data?.me;
  const initials = user?.fullName ? user.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'ST';
  const registeredCourses = user?.registeredCourses || [];
  const totalUnits = registeredCourses.reduce((sum: number, course: any) => sum + course.units, 0);

  return (
    <div className="page-wrapper">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Student Profile & Course Form</h2>
          <p>Official bio-data and academic registration records.</p>
        </div>
      </div>

      <div className="content-card profile-card" style={{ marginBottom: '2rem' }}>
        <div className="profile-header-banner"></div>
        
        {/* Render Avatar Uploader in place of static avatar circle */}
        <AvatarUploader currentAvatar={user?.avatar} initials={initials} />
        
        <div className="profile-details-grid">
          <div className="detail-group">
            <label>Full Name</label>
            <p>{user?.fullName}</p>
          </div>
          <div className="detail-group">
            <label>Matriculation Number</label>
            <p>{user?.matricNumber || 'Pending Assignment'}</p>
          </div>
          <div className="detail-group">
            <label>Department</label>
            <p>{user?.department || 'Not Assigned'}</p>
          </div>
          <div className="detail-group">
            <label>Current Level</label>
            <p>{user?.level || '100 Level'}</p>
          </div>
          <div className="detail-group">
            <label>Email Address</label>
            <p>{user?.email}</p>
          </div>
          <div className="detail-group">
            <label>Financial Status</label>
            <p style={{ color: user?.hasPaidFees ? 'green' : 'red', fontWeight: 'bold' }}>
              {user?.hasPaidFees ? 'Fees Paid' : 'Fees Unpaid'}
            </p>
          </div>
        </div>
      </div>

      {/* The Printable Registered Courses Section */}
      <div className="content-card">
        <div className="card-header" style={{ padding: '1.5rem', borderBottom: '1px solid #edf2f7' }}>
          <h3 style={{ color: '#2b3674' }}>Registered Courses (Harmattan Semester)</h3>
        </div>
        
        {registeredCourses.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#718096' }}>
            No courses registered for this semester yet.
          </div>
        ) : (
          <div style={{ padding: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#4a5568' }}>
                  <th style={{ padding: '12px 8px' }}>Course Code</th>
                  <th style={{ padding: '12px 8px' }}>Course Title</th>
                  <th style={{ padding: '12px 8px' }}>Units</th>
                </tr>
              </thead>
              <tbody>
                {registeredCourses.map((course: any) => (
                  <tr key={course.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 'bold', color: '#2b3674' }}>{course.code}</td>
                    <td style={{ padding: '12px 8px', color: '#4a5568' }}>{course.title}</td>
                    <td style={{ padding: '12px 8px', color: '#4a5568' }}>{course.units}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} style={{ padding: '16px 8px', textAlign: 'right', fontWeight: 'bold' }}>Total Units:</td>
                  <td style={{ padding: '16px 8px', fontWeight: 'bold', color: '#2b3674' }}>{totalUnits}</td>
                </tr>
              </tfoot>
            </table>
            <button 
              style={{ color: '#FFF', backgroundColor: '#2b3674', marginTop: '1rem' }}
              className="secondary-btn" 
              onClick={() => downloadProfileForm(user)}
            >
              Download Course Form
            </button>
          </div>
        )}
      </div>
    </div>
  );
}