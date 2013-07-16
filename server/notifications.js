Notifications.insertNotification = function(notification){
    notification.timestamp = new Date().getTime();
    return Notifications.insert(notification);
};
