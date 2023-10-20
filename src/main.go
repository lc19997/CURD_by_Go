package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-contrib/cors"
	//"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	_ "github.com/lib/pq"
)

var db *sql.DB
var count int

type embeddedBlog struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

type Blog struct {
	embeddedBlog
	ID int `json:"id"`
}

func dbcon() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Build the connection string
	connStr := fmt.Sprintf("user=%s dbname=%s password=%s host=%s port=%s sslmode=disable",
		os.Getenv("PG_USER"),
		os.Getenv("PG_DBNAME"),
		os.Getenv("PG_PASSWORD"),
		os.Getenv("PG_HOST"),
		os.Getenv("PG_PORT"),
	)

	db, err = sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}
	fmt.Printf("connected")
}

func main() {

	dbcon()

	count = 0

	r := gin.Default()

	//r.Use(static.Serve("/", static.LocalFile("./views", true)))

	r.Use(cors.Default())
	defer db.Close()

	// Retrieve all blogs
	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})
	api := r.Group("/api")
	{
		api.GET("/", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "pong",
			})
		})
		api.GET("/blogs", displayBlogs)
		api.POST("/create", createBlog)
		api.POST("/update/:id", updateBlog)
		api.POST("/delete/:id", deleteBlog)
	}
	r.Run()
}

func displayBlogs(c *gin.Context) {
	dbcon()

	rows, err := db.Query("SELECT id, title, content FROM blogs")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()
	var result []map[string]interface{}
	columns, _ := rows.Columns()
	values := make([]interface{}, len(columns))
	valuePtrs := make([]interface{}, len(columns))

	for rows.Next() {
		for i := range columns {
			valuePtrs[i] = &values[i]
		}
		if err := rows.Scan(valuePtrs...); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		entry := make(map[string]interface{})
		for i, col := range columns {
			var v interface{}
			val := values[i]
			b, ok := val.([]byte)
			if ok {
				v = string(b)
			} else {
				v = val
			}
			entry[col] = v
		}
		result = append(result, entry)
	}

	c.JSON(http.StatusOK, result)
	defer db.Close()
}

func createBlog(c *gin.Context) {
	var blog Blog
	var tmp embeddedBlog
	dbcon()
	if err := c.ShouldBindJSON(&tmp); err != nil {
		//	if err := json.NewDecoder(c.Request.Body).Decode(&blog); err != nil {
		c.JSON(400, gin.H{"error": "Invalid rrrequest payload"})
		return
	}

	result, err := db.Exec(`INSERT INTO blogs (title, content) VALUES ($1, $2)`, tmp.Title, tmp.Content)
	if err != nil {
		fmt.Printf(err.Error())
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	id, _ := result.LastInsertId()
	blog.ID = int(id)

	//fmt.Printf("%s", ssd)

	c.JSON(201, blog)

	defer db.Close()
}

func updateBlog(c *gin.Context) {
	dbcon()
	fmt.Printf(c.Param("id"))
	id, err := strconv.Atoi(c.Param("id"))

	var tmp embeddedBlog
	if err := c.ShouldBindJSON(&tmp); err != nil {

		c.JSON(400, gin.H{"error": "Invalid request payload"})
		return
	}

	result, err := db.Exec("UPDATE blogs SET title=$1, content=$2 WHERE id=$3", tmp.Title, tmp.Content, id)
	if err != nil {
		fmt.Printf(err.Error())
		c.JSON(500, gin.H{"error": "Failed to update blog"})
		return
	}

	c.JSON(201, result)

	defer db.Close()

}

func deleteBlog(c *gin.Context) {
	dbcon()
	id := c.Param("id")

	_, err := db.Exec("DELETE FROM blogs WHERE id=$1", id)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to delete blog"})
		return
	}

	c.JSON(200, gin.H{"message": "Blog deleted successfully"})
	defer db.Close()
}
