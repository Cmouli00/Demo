package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port          string
	MongoURI      string
	MongoDatabase string
	JWTSecret     string
	AppOneOrigin  string
	AppTwoOrigin  string
}

func Load() Config {
	_ = godotenv.Load()

	return Config{
		Port:          getEnv("PORT", "8000"),
		MongoURI:      getEnv("MONGO_URI", "mongodb://localhost:27017"),
		MongoDatabase: getEnv("MONGO_DATABASE", "shared_platform"),
		JWTSecret:     getEnv("JWT_SECRET", ""),
		AppOneOrigin:  getEnv("APP_ONE_ORIGIN", ""),
		AppTwoOrigin:  getEnv("APP_TWO_ORIGIN", ""),
	}
}

func getEnv(key, fallback string) string {
	value := os.Getenv(key)

	if value == "" {
		return fallback
	}

	return value
}
