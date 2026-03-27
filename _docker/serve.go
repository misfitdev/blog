package main

import (
	"log"
	"net/http"
)

func main() {
	log.Println("serving /srv on :4000")
	log.Fatal(http.ListenAndServe(":4000", http.FileServer(http.Dir("/srv"))))
}
