package com.bob.flowerPan.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderDto {
    private Long id;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private LocalDateTime createdAt;
    private List<OrderItemDto> items;
    private Double totalPrice;
}


