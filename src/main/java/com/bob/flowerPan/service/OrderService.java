package com.bob.flowerPan.service;

import com.bob.flowerPan.dto.OrderDto;
import com.bob.flowerPan.dto.OrderMapper;
import com.bob.flowerPan.model.Order;
import com.bob.flowerPan.model.OrderItem;
import com.bob.flowerPan.model.Product;
import com.bob.flowerPan.repository.OrderRepo;
import com.bob.flowerPan.repository.ProductRepo;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class OrderService {

    private final OrderRepo repository;
    private final ProductRepo productRepository;

    public OrderService(OrderRepo repository, ProductRepo productRepository){
        this.repository = repository;
        this.productRepository = productRepository;
    }

    public List<OrderDto> findAll(){
        return repository.findAll().stream()
                .map(OrderMapper::toDto)
                .toList();
    }

    @Transactional
    public void saveOrder(Order order, boolean isAdmin){

        if (!isAdmin && order.getId() != null) {
            throw new RuntimeException("Обновление заказов запрещено");
        }

        for (OrderItem item : order.getItems()) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Товар не найден: " + item.getProduct().getId()));

            if (product.getInStock() < item.getQuantity()) {
                throw new RuntimeException("позиции \"" + product.getName() + "\" недостаточно на складе");
            }

            product.setInStock(product.getInStock() - item.getQuantity());
            productRepository.save(product);

            item.setProduct(product);
            item.setOrder(order);
        }

        repository.save(order);
    }

    public void delete(long id){
        repository.deleteById(id);
    }
}
