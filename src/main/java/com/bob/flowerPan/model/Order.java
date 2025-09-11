package com.bob.flowerPan.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty
    private String customerName;

    @NotEmpty
    @Pattern(
            regexp = "^(\\+7|8)\\d{10}$",
            message = "Номер телефона указан некорректно"
    )
    private String customerPhone;

    @NotEmpty
    @Email
    private String customerEmail;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @NotEmpty
    private List<OrderItem> items = new ArrayList<>();

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate(){
        this.createdAt = LocalDateTime.now();
    }

    @Size(max = 255)
    private String address;

    @Size(max = 255)
    private String comment;

    private String deliveryTime;

    private boolean paid;
}
