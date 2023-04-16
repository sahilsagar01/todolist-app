const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js")


const app = express();



app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchima = {
    name: String
};

const Item = mongoose.model("Item" , itemSchima)

const Item1 = new Item({
    name: "Welcome to your todolist!"
});

const Item2 = new Item({
    name: "Hit the + button to add a new item."
});

const Item3 = new Item({
    name: "<---- Hit this to delete an item."
});

const inItems = [Item1 , Item2 , Item3];

app.get("/" , function(req , res){

    

    Item.find({})
    .then(function(founditems) {

        if(founditems.length === 0) {
            Item.insertMany(inItems)
             .then(function() {
              console.log("successfully created.")
            })
            .catch(function(err) {
            console.error(err)
            });
            res.redirect("/");
           }else {
            res.render("list", {listTitle: day, newItems: founditems});
           }
           })
          .catch(function(err){
             console.log(err);
          });

    const day = date.getDate();

});

app.post("/" , function(req , res ) {

    const newItem = req.body.newitem;

    const item = new Item({
        name: newItem
    });
    item.save();
    res.redirect("/");
    // if(req.body.list === "workList") {
    //     workItems.push(item);
    //     res.redirect("/work");
    // } else {
    //     items.push(item);
    //     res.redirect("/");
    // }
});

app.post("/delete" , function(req , res) {
    const checkedItemId = req.body.checkbox;
    Item.deleteOne(checkedItemId)
    .then(function(){
        console.log("successfully deleted")
    })
    .catch(function(err){
        console.log(err);
    })
    res.redirect("/");
   
});


app.get("/work" , function(req ,res){
    res.render("list" , {listTitle: "workList", newItems: workItems});
});
app.post("/work" , function(req , res) {
    let item = req.body.items;
    workItems.push(item);
    res.redirect("/work");

});
app.get("/about" , function(req,res) {
    res.render("about");
})
app.listen(3000 , function(){
    console.log("server is starter on port 3000.")
});