package main

import (
	"context"
	"log"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"company.com/m/internal/config"
	"company.com/m/internal/database"
	"company.com/m/internal/router"
)

func main() {
	cfg := config.Load()

	// if cfg.JWTSecret == "" {
	// 	log.Fatal("JWT_SECRET is required")
	// }

	ctx, cancel := context.WithTimeout(
		context.Background(),
		10*time.Second,
	)
	defer cancel()

	mongoDB, err := database.Connect(
		ctx,
		cfg.MongoURI,
		cfg.MongoDatabase,
	)

	if err != nil {
		log.Fatal("MongoDB connection failed: ", err)
	}

	defer func() {
		shutdownCtx, cancel := context.WithTimeout(
			context.Background(),
			10*time.Second,
		)
		defer cancel()

		if err := mongoDB.Close(shutdownCtx); err != nil {
			slog.Error("MongoDB disconnect failed", "error", err)
		}
	}()

	engine := router.Setup(mongoDB.Database)

	server := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           engine,
		ReadHeaderTimeout: 5 * time.Second,
	}

	go func() {
		slog.Info("Server starting", "port", cfg.Port)

		if err := server.ListenAndServe(); err != nil &&
			err != http.ErrServerClosed {
			slog.Error("Server failed", "error", err)
			os.Exit(1)
		}
	}()

	stop := make(chan os.Signal, 1)

	signal.Notify(
		stop,
		syscall.SIGINT,
		syscall.SIGTERM,
	)

	<-stop

	shutdownCtx, shutdownCancel := context.WithTimeout(
		context.Background(),
		10*time.Second,
	)
	defer shutdownCancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		slog.Error("Server shutdown failed", "error", err)
	}
}
