package com.duan.server.Controllers;

import com.duan.server.DTO.CategoryDTO;
import com.duan.server.Response.CodeAndMessage;
import com.duan.server.Response.ResponseCategory;
import com.duan.server.Services.Implement.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/category")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @PostMapping("/add")
    public ResponseEntity<?> insertCategory( @RequestPart("thumbnail") MultipartFile image,
                                             @RequestParam("typeOfEvent") String typeName){
        try{
            CategoryDTO categoryDTO1 = categoryService.persist(image,typeName);
            return new ResponseEntity<>(ResponseCategory
                    .builder()
                    .code(0)
                    .message("Insert new type of category success")
                    .categoryDTO(categoryDTO1)
                    .build(), HttpStatus.OK);

        }catch (Exception e){
            return new ResponseEntity<>(CodeAndMessage.builder()
                    .code(1)
                    .message("Fail to add new Category!! pls try again")
                    .build(), HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/all-categories")
    public ResponseEntity<?> AllCategories(){
        try{
            return new ResponseEntity<>(categoryService.findAllCategory(), HttpStatus.OK);

        }catch (Exception e){
            return new ResponseEntity<>(CodeAndMessage.builder()
                    .code(1)
                    .message("Fail to add new Category!! pls try again")
                    .build(), HttpStatus.BAD_REQUEST);
        }
    }


    @DeleteMapping("/delete/{type}")
    public ResponseEntity<?> removeCategory(@PathVariable("type") String type){
        try{
            if (categoryService.remove(type)){
                return new ResponseEntity<>(CodeAndMessage.builder()
                        .code(0)
                        .message("Delete success category with type = " + type)
                        .build(), HttpStatus.OK);
            }else{
                return new ResponseEntity<>(CodeAndMessage.builder()
                        .code(1)
                        .message("Fail to delete Category!! pls try again")
                        .build(), HttpStatus.BAD_REQUEST);
            }

        }catch (Exception e){
            return new ResponseEntity<>(CodeAndMessage.builder()
                    .code(1)
                    .message("Fail caused by Server!!")
                    .build(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
