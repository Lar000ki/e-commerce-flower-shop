package com.bob.flowerPan.dto;

import com.bob.flowerPan.model.Order;

import java.util.List;

public class OrderMapper {
    public static OrderDto toDto(Order order) {
        List<OrderItemDto> items = order.getItems().stream()
                .map(item -> new OrderItemDto(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getPrice(),
                        item.getQuantity()
                ))
                .toList();

        return new OrderDto(
                order.getId(),
                order.getCustomerName(),
                order.getCustomerPhone(),
                order.getCustomerEmail(),
                order.getCreatedAt(),
                items,
                items.stream()
                        .mapToDouble(item -> item.getPrice() * item.getQuantity())
                        .sum()
        );
    }
}
