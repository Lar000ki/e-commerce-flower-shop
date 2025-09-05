package com.bob.flowerPan.controller;

import com.bob.flowerPan.model.Product;
import com.bob.flowerPan.model.User;
import com.bob.flowerPan.service.UserService;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody User user) {
            userService.register(user);
            return ResponseEntity.ok("ok");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequest request){
        Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(auth);
        return ResponseEntity.ok("ok");
    }

    @PostMapping("/save")
    public ResponseEntity<String> save(@Valid @RequestBody User user){
        userService.saveUser(user);
        return ResponseEntity.ok("ok");
    }

    @GetMapping("/all")
    //need cacheable
    public ResponseEntity<List<User>> getAll(){
        return ResponseEntity.ok(userService.findAll());
    }

    @DeleteMapping
    public ResponseEntity<String> delete(@RequestParam long id){
        userService.delete(id);
        return ResponseEntity.ok("ok");
    }

}

@Data
class AuthRequest {
    private String email;
    private String password;
}
