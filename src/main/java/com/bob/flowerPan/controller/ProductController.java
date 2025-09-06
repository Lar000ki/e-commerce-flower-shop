package com.bob.flowerPan.controller;

import com.bob.flowerPan.model.Product;
import com.bob.flowerPan.repository.ProductRepo;
import com.bob.flowerPan.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

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

    @PostMapping(value = "/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> savePhoto(@RequestParam long id, @RequestParam("image") MultipartFile file) throws IOException {
        productService.savePhoto(id, file);
        return ResponseEntity.ok("ok");
    }

    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> Photo(@PathVariable String filename) throws IOException {

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(productService.getPhoto(filename));
    }

}
