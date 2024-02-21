const http = require("http");
const fs = require(`fs`)
const path = require (`path`)
const {authenticateUser}= require(`./authenticate`);

const bookDB = path.join(__dirname,"dataBase", "bookDB.json")
const PORT= 8000;
const HOST_NAME = `127.0.0.1`


const requestHandler = async function(req, res){
   res.setHeader("Content-Type","application/json")
    if (req.url === `/books`&& req.method ==="GET"){
        authenticateUser(req,res)
        .then(()=>{
         getAllbooks (req,res);
        }).catch((err)=>{
           res.statusCode =401;
           res.end(JSON.stringify({
              message:"internal error"
           }))
        })
   
      }else if( req.url === `/books` && req.method === "POST"){
        addBook(req,res);
       }else if( req.url === `/books` && req.method === "DELETE"){
        console.log("delete request to books route");
       }else if ( req.url === `/books/author/` && req.method === "GET"){
          console.log("get request to books and author")
       }else if ( req.url === `/books/author/` && req.method === "POST"){
        console.log("post request to books and author")
     }else if ( req.url === `/books/author/` && req.method === "PUT"){
        console.log("put request to books and author")
     }else if ( req.url === `/books/author/` && req.method === "DELETE"){
      console.log("delete request to books and author")
   }else{
    res.writeHead(404)
    res.end({
      message:"route not found"
    })
   }

};


function getAllbooks (req,res){
    fs.readFile(bookDB, "utf-8", (err, data)=>{
      if(err){
        console.log(err)
        res.writeHead(400)
        res.end("an error occurred")
      }
      res.end(data);
    })
}

function addBook(req, res){
    const body= [];
    req.on("data",(chunk)=>{
       body.push(chunk)
    })

    req.on ("end", ()=>{
        const chipsData = Buffer.concat(body).toString()
        const parsedChipsData = JSON.parse(chipsData);
        console.log(parsedChipsData);
    })


    fs.readFile(bookDB, "utf-8", (err, data)=>{
      if(err){
        console.log(err)
        res.writeHead(400)
        res.end("an error occurred");
      }
      const oldReadData= JSON.parse(data);
      const newUpdatedData =[...oldReadData,parsedChipsData ];
      console.log(newUpdatedData);


// since we want to write into the file, we would have to convert the parsed file back to string to make it writeable
      fs.writeFile(bookDB,JSON.stringify(newUpdatedData),(err)=>{
         if(err){
          console.log(err)
          res.writeHead(500)
          res.end({message:"there seems to be an internal error"})
         }

      })
    })
}


   function deleteBook(req, res) {
      const body = []
  
      req.on("data", (chunk) => {
          body.push(chunk)
      })
  
      req.on("end", () => {
          const parsedBook = Buffer.concat(body).toString()
          const detailsToUpdate = JSON.parse(parsedBook)
          const bookId = detailsToUpdate.id
  
          fs.readFile(booksDbPath, "utf8", (err, books) => {
              if (err) {
                  console.log(err)
                  res.writeHead(400)
                  res.end("An error occured")
              }
  
              const booksObj = JSON.parse(books)
  
              const bookIndex = booksObj.findIndex(book => book.id === bookId)
  
              if (bookIndex === -1) {
                  res.writeHead(404)
                  res.end("Book with the specified id not found!")
                  return
              }
  
              // DELETE FUNCTION
              booksObj.splice(bookIndex, 1)
  
              fs.writeFile(booksDbPath, JSON.stringify(booksObj), (err) => {
                  if (err) {
                      console.log(err);
                      res.writeHead(500);
                      res.end(JSON.stringify({
                          message: 'Internal Server Error. Could not save book to database.'
                      }));
                  }
  
                  res.writeHead(200)
                  res.end("Deletion successfull!");
              });
  
          })
  
      })
  }




   function updateBook(req, res) {
      const body = []
  
      req.on("data", (chunk) => {
          body.push(chunk)
      })
  
      req.on("end", () => {
          const parsedBook = Buffer.concat(body).toString()
          const detailsToUpdate = JSON.parse(parsedBook)
          const bookId = detailsToUpdate.id
  
          fs.readFile(booksDbPath, "utf8", (err, books) => {
              if (err) {
                  console.log(err)
                  res.writeHead(400)
                  res.end("An error occured")
              }
  
              const booksObj = JSON.parse(books)
  
              const bookIndex = booksObj.findIndex(book => book.id === bookId)
  
              if (bookIndex === -1) {
                  res.writeHead(404)
                  res.end("Book with the specified id not found!")
                  return
              }
  
              const updatedBook = { ...booksObj[bookIndex], ...detailsToUpdate }
              booksObj[bookIndex] = updatedBook
  
              fs.writeFile(booksDbPath, JSON.stringify(booksObj), (err) => {
                  if (err) {
                      console.log(err);
                      res.writeHead(500);
                      res.end(JSON.stringify({
                          message: 'Internal Server Error. Could not save book to database.'
                      }));
                  }
  
                  res.writeHead(200)
                  res.end("Update successfull!");
              });
  
          })
  
      })
  }
  


const server = http.createServer(requestHandler);
server.listen(PORT, HOST_NAME,()=>{
console.log(`server is running on http://${HOST_NAME}:${PORT}`)
} );
