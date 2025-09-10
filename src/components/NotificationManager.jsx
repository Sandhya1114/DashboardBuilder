import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { removeNotification } from '../store/store';
import './NotificationManager.css';

const NotificationManager = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector(state => state.ui);

  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    const timers = notifications.map(notification => {
      if (notification.type !== 'error') {
        return setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, 5000);
      }
      return null;
    });

    return () => {
      timers.forEach(timer => timer && clearTimeout(timer));
    };
  }, [notifications, dispatch]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  const handleClose = (id) => {
    dispatch(removeNotification(id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-icon">
            {getNotificationIcon(notification.type)}
          </div>
          <div className="notification-content">
            <p className="notification-message">{notification.message}</p>
            {notification.description && (
              <p className="notification-description">{notification.description}</p>
            )}
          </div>
          <button
            className="notification-close"
            onClick={() => handleClose(notification.id)}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationManager;