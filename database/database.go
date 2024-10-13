package database

import (
	"fmt"
	"log"

	"go-k6/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {

	dsn := "host=k6-demo.chueimam6prd.eu-north-1.rds.amazonaws.com user=postgres password=49Js2cPBl274t dbname=postgres port=5432 sslmode=require"
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	} else {
		fmt.Println("Database connected successfully")

		DB.AutoMigrate(&models.Product{})
	}
}
