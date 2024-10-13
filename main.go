package main

import (
	"encoding/json"
	"fmt"
	"go-k6/database"
	"go-k6/models"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	app := fiber.New(fiber.Config{
		AppName:     "Fiber-k6",
		JSONEncoder: json.Marshal,
		JSONDecoder: json.Unmarshal,
	})

	database.InitDB()

	app.Use(compress.New())
	app.Use(recover.New())

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	app.Get("/products", func(c *fiber.Ctx) error {
		var products []models.Product
		database.DB.Find(&products)
		return c.JSON(products)
	})

	app.Post("/products", func(c *fiber.Ctx) error {
		product := new(models.Product)
		if err := c.BodyParser(product); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
		}
		database.DB.Create(&product)
		return c.Status(fiber.StatusCreated).JSON(product)
	})

	fmt.Println("Server is running on port 3000")

	app.Listen(":3000")
}
