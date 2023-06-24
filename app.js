const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js")


const app = express();




app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item" , itemSchema)

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

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List" , listSchema);

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
            res.render("list", {listTitle: "Today", newItems: founditems});
           }
           })
          .catch(function(err){
             console.log(err);
          });

    // const day = date.getDate();

});

app.get("/:customeListName" , function(req , res) {
    const customeListName = req.params.customeListName;

   List.findOne({name: customeListName})
   .then(function(foundList, err) {
    if(!err){
        if(!foundList){
           //creat a new list//
           const list = new List({
            name: customeListName,
            items: inItems
        });
        list.save();
        res.redirect("/" + customeListName); 
        }else{
            res.render("list" , {listTitle: foundList.name, newItems: foundList.items})
        }
    }
   })
   .catch(function(err){
    res.json(err)
   })




 
 
 });

app.post("/" , function(req , res ) {

    const newItem = req.body.newitem;
    const listName = req.body.list

    const item = new Item({
        name: newItem
    });

    if(listName === "Today"){
        item.save();
        res.redirect("/")
    }else
    List.findOne({name: listName})
    .then(function(foundList , err){
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName)
    })
    .catch(function(err){
        console.log(err)
    })
    // res.redirect("/");
    // if(req.body.list === "workList") {
    //     workItems.push(item);
    //     res.redirect("/work");
    // } else {
    //     items.push(item);
    //     res.redirect("/");
    // }
});

app.post("/delete" , function(req , res) {
    const checkedObject = req.body.checkbox;
    const listName = req.body.listName;

    if(listName == "Today") {
        Item.findByIdAndDelete(checkedObject)
        .then(function(doc , err){
            if(!err){
                console.log("succesfully deleted");
                res.redirect("/")
            }
        })
    }else{
        List.findOneAndUpdate({name: listName} , {$pull:{items: {_id:checkedObject}}})
        .then(function(doc , err){
            if(!err){
                res.redirect("/"+listName);
            }
        })
    }
    //   if (listName === "Today") {
    //     Item.findByIdAndRemove(checkedObject)
    //     .then(function(doc ,err){
    //         if(!err) {
    //             console.log("successfully deleted");
    //             res.redirect("/");
    //         }
    //     })
    //   }
    //   else{
    //     List.findOneAndUpdate({name:listName} , {$pull: {items: {_id: checkedObject}}})
    //     .then(function(doc , err){
    //         if(!err){
    //        res.redirect("/" + listName);
    //         }
    //     })

    // }
   
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