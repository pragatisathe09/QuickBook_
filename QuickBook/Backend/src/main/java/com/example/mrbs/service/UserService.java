package com.example.mrbs.service;

import com.example.mrbs.dto.SignupRequest;
import com.example.mrbs.exception.EmailDomainException;
import com.example.mrbs.exception.ResourceNotFoundException;
import com.example.mrbs.model.User;
import com.example.mrbs.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }

    @Transactional
    public User createUser(SignupRequest signupRequest) {
        // Check if email has valid domain
        String email = signupRequest.getEmail();
        if (!email.endsWith("@jadeglobal.com") && !email.endsWith("@kanverse.com")) {
            throw new EmailDomainException("Email domain not allowed. Only @jadeglobal.com or @kanverse.com are accepted.");
        }

        // Check if user already exists
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already in use!");
        }

        // Create new user
        User user = new User();
        user.setName(signupRequest.getName());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));

        // Set role if provided, otherwise default to employee
        if (signupRequest.getRole() != null && signupRequest.getRole().equalsIgnoreCase("admin")) {
            user.setRole(User.UserRole.admin);
        } else {
            user.setRole(User.UserRole.employee);
        }

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    @Transactional(readOnly = true)
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User updateUser(String email, User userDetails) {
        User user = findByEmail(email);

        user.setName(userDetails.getName());

        // We don't update email or password here for security reasons
        // Those should be separate endpoints with proper verification

        return userRepository.save(user);
    }

    @Transactional
    public User updateUserRole(Long id, String role) {
        User user = findById(id);

        if (role.equalsIgnoreCase("admin")) {
            user.setRole(User.UserRole.admin);
        } else if (role.equalsIgnoreCase("employee")) {
            user.setRole(User.UserRole.employee);
        } else {
            throw new IllegalArgumentException("Invalid role: " + role);
        }

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = findById(id);
        userRepository.delete(user);
    }
}