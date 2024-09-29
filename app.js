const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcryptjs")
const {adminModel}=require("./models/Admin")
const { userModel } = require("./models/User")

const app=express()
app.use(cors())
app.use(express.json())

const generateHashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

mongoose.connect("mongodb+srv://jophine:jophinepaul@cluster0.oyyvgui.mongodb.net/TurfDB?retryWrites=true&w=majority&appName=Cluster0")

app.post("/adminSignUp",async(req,res)=>
{
    let input=req.body
    let hashedpassword=await generateHashPassword(input.admin_password)
    console.log(hashedpassword)
    input.admin_password=hashedpassword
    let admin=new adminModel(input)
    admin.save()
    res.json({"Status":"Saved"})
})


app.post("/userSignUp",async(req,res)=>
{
    let input=req.body
    let hashedpassword=await generateHashPassword(input.user_password)
    console.log(hashedpassword)
    input.user_password=hashedpassword
    let user=new userModel(input)
    user.save()
    res.json({"status":"Saved"})
})


app.post("/userLogin",async(req,res)=>
    {
        let input=req.body
        userModel.find({"user_name":req.body.user_name}).then(
            (response)=>{
                if(response.length>0)
                    {
                        let dbuserPassword=response[0].user_password
                        bcrypt.compare(input.user_password,dbuserPassword,(error,isMatch)=>
                        {
                            if(isMatch)
                                {
                                    res.json({"status":"login success"})
                                }
                            else
                            {
                                res.json({ "status": "incorrect" })
    
                            }
                        })
                    }
                    else
                    {
                        res.json({ "status": "User Not Found" })
    
                    }
            }
        )
    })


app.post("/adminLogin",async(req,res)=>
{
    let input=req.body
    adminModel.find({"admin_name":req.body.admin_name}).then(
        (response)=>{
            if(response.length>0)
                {
                    let dbAdminPassword=response[0].admin_password
                    bcrypt.compare(input.admin_password,dbAdminPassword,(error,isMatch)=>
                    {
                        if(isMatch)
                            {
                                res.json({"status":"login success"})
                            }
                        else
                        {
                            res.json({ "status": "incorrect" })

                        }
                    })
                }
                else
                {
                    res.json({ "status": "User Not Found" })

                }
        }
    )
})



app.listen(8080,()=>{
    console.log("Server initiated")
})
