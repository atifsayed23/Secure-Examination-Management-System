package com.sems.semsbackend.service;

import com.sems.semsbackend.entity.Notification;
import com.sems.semsbackend.entity.User;
import com.sems.semsbackend.exception.ResourceNotFoundException;
import com.sems.semsbackend.repository.NotificationRepository;
import com.sems.semsbackend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void createNotification(User user, String title, String message, String type) {
        Notification notification = new Notification(user, title, message, type);
        notificationRepository.save(notification);
    }

    @Transactional
    public void notifyAllUsersByRole(String roleName, String title, String message, String type) {
        List<User> users = userRepository.findByRoleRoleName(roleName);
        for (User user : users) {
            createNotification(user, title, message, type);
        }
    }

    @Transactional
    public void notifyAllAdmins(String title, String message, String type) {
        notifyAllUsersByRole("SUPER_ADMIN", title, message, type);
        notifyAllUsersByRole("EXAM_CONTROLLER", title, message, type);
    }

    @Transactional
    public void notifyAllStudents(String title, String message, String type) {
        notifyAllUsersByRole("STUDENT", title, message, type);
    }

    public List<Notification> getUserNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public long getUnreadCount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    @Transactional
    public void markAsRead(Long notificationId, String email) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        if (!notification.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("You can only access your own notifications.");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
