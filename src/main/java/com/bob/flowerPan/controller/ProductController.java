package com.bob.flowerPan.controller;

import com.bob.flowerPan.model.Product;
import com.bob.flowerPan.repository.ProductRepo;
import com.bob.flowerPan.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @GetMapping("/all")
    //need cacheable
    public ResponseEntity<List<Product>> getAll(){
        return ResponseEntity.ok(productService.findAll());
    }

    @PostMapping("/save")
    public ResponseEntity<String> saveProduct(@Valid @RequestBody Product product){
        productService.saveProduct(product);
        return ResponseEntity.ok("ok");
    }

    @DeleteMapping
    public ResponseEntity<String> delete(@RequestParam long id){
        productService.delete(id);
        return ResponseEntity.ok("ok");
    }
}
