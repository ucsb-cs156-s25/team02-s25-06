package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

import edu.ucsb.cs156.example.entities.MenuItemReview;
import edu.ucsb.cs156.example.repositories.MenuItemReviewRepository;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class MenuItemReviewWebIT extends WebTestCase {

    // @MockBean
    // UserRepository userRepository;
    @Autowired
    MenuItemReviewRepository menuItemReviewRepository;

    @Test
    public void admin_user_can_create_edit_delete_menuItemReview() throws Exception {
        LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00");
        MenuItemReview menuItemReview = MenuItemReview.builder()
                        .itemId(5)
                        .reviewerEmail("cgaucho@ucsb.edu")
                        .stars(5)
                        .dateReviewed(ldt1)
                        .comments("Nocomments")
                        .build();
                        
        menuItemReviewRepository.save(menuItemReview);
        
        setupUser(true);

        page.getByText("Menu Item Reviews").click(); //the button

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-itemId")).hasText("5");
        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-reviewerEmail")).hasText("cgaucho@ucsb.edu");
        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-stars")).hasText("5");
        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-dateReviewed")).hasText("2022-01-03T00:00:00");
        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments")).hasText("Nocomments");


        page.getByTestId("MenuItemReviewTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Menu Item Review")).isVisible();
        page.getByTestId("MenuItemReviewForm-comments").fill("THE BEST");
        page.getByTestId("MenuItemReviewForm-submit").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments")).hasText("THE BEST");

        page.getByTestId("MenuItemReviewTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-itemId")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_menuItemReview() throws Exception {
        setupUser(false);

        page.getByText("Menu Item Reviews").click(); //the button

        assertThat(page.getByText("Create Menu Item Review")).not().isVisible();
        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-itemId")).not().isVisible();
    }

    @Test
    public void admin_user_can_create_menuItemReview() throws Exception {
        setupUser(true);

        page.getByText("Menu Item Reviews").click(); //the button

        assertThat(page.getByText("Create Menu Item Review")).isVisible();
    }
}


// package edu.ucsb.cs156.example.web;

// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.test.annotation.DirtiesContext;
// import org.springframework.test.annotation.DirtiesContext.ClassMode;
// import org.springframework.test.context.ActiveProfiles;
// import org.springframework.test.context.junit.jupiter.SpringExtension;

// import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

// import edu.ucsb.cs156.example.WebTestCase;

// @ExtendWith(SpringExtension.class)
// @SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
// @ActiveProfiles("integration")
// @DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
// public class MenuItemReviewWebIT extends WebTestCase {
//     @Test
//     public void admin_user_can_create_edit_delete_restaurant() throws Exception {
//         setupUser(true);

//     //     page.getByText("Restaurants").click();

//     //     page.getByText("Create Restaurant").click();
//         assertThat(page.getByText("Menu Item Reviews")).isVisible();
//         System.out.println("URL: " + page.url());
//         System.out.println(page.content());
//     //     page.getByTestId("RestaurantForm-name").fill("Freebirds");
//     //     page.getByTestId("RestaurantForm-description").fill("Build your own burrito chain");
//     //     page.getByTestId("RestaurantForm-submit").click();

//     //     assertThat(page.getByTestId("RestaurantTable-cell-row-0-col-description"))
//     //             .hasText("Build your own burrito chain");

//     //     page.getByTestId("RestaurantTable-cell-row-0-col-Edit-button").click();
//     //     assertThat(page.getByText("Edit Restaurant")).isVisible();
//     //     page.getByTestId("RestaurantForm-description").fill("THE BEST");
//     //     page.getByTestId("RestaurantForm-submit").click();

//     //     assertThat(page.getByTestId("RestaurantTable-cell-row-0-col-description")).hasText("THE BEST");

//     //     page.getByTestId("RestaurantTable-cell-row-0-col-Delete-button").click();

//     //     assertThat(page.getByTestId("RestaurantTable-cell-row-0-col-name")).not().isVisible();
//     }

//     // @Test
//     // public void regular_user_cannot_create_restaurant() throws Exception {
//     //     setupUser(false);

//     //     page.getByText("Restaurants").click();

//     //     assertThat(page.getByText("Create Restaurant")).not().isVisible();
//     //     assertThat(page.getByTestId("RestaurantTable-cell-row-0-col-name")).not().isVisible();
//     // }
// }