const Property = require('../../models/propertyModel/property.model');
const customError=require('../../utils/customError');
const logger = require('../../utils/logger');

const createProperty=async (req,res,next)=>{
    try {
        const {title,description,location,price,amenities,images}=req.body;

        if(!title || !description || !location || !price || !amenities){
            return next(new customError("please provide all fields",400))
        }

        const existingProperty=await Property.findOne({title});
        if(existingProperty){
            return next(new customError("property aleardy exists",400))
        }

        const newProperty=await Property.create({
            title,
            description,
            location,
            price,
            amenities,
            images,
            host:req.user._id
        })

        return res.status(200).json({
            status:true,
            message:"Property created successfully",
            data:newProperty
        })
    } catch (error) {
        next(new customError(error.message,400));
    }
}

const viewProperty= async (req,res,next)=>{
    try {

        const {id}=req.params;
        console.log("id",id);
        if(!id){
            return next(new customError("property id is required",400));
        }
        
        const property=await Property.findById(id);
        if(!property){
            return next(new customError("property not found",400));
        }

        res.status(200).json({
            status:true,
            message:"property fechted successfully",
            data:property
        })
    } catch (error) {
        return next(new customError(error.message,500));
    }
}

const updateProperty=async (req,res,next)=>{
    try {
        const {id}=req.params;
        if(!id){
            return next(new customError("property id is required",400));
        }

        const updatedProperty=await Property.findByIdAndUpdate(id,req.body,{
            new:true,
            runValidators:true
        })
        if(!updatedProperty){
            return next(new customError("error in updating property",400));
        }

        res.status(200).json({
            status:true,
            mesage:"property updated successfully",
            data:updatedProperty
        })

    } catch (error) {
        return next(new customError(error.message,500))
    }
}
 
const deleteProperty=async (req,res,next)=>{
    const {id}=req.params;
    try {
        if(!id){
            return next(new customError("property id is required",400));
        }
        const deletedProperty = await Property.findByIdAndDelete(id);
            if(!deletedProperty){
                return next(new customError("property not found",400));
            }
        res.status(200).json({
            status:true,
            message:"property deleted successfully",
            data:deletedProperty
        })
    } catch (error) {
        return next(new customError(error.message,400));
    }
}

const searchProperty=async (req,res,next)=>{
    try {
        const {location,minPrice,maxPrice}=req.body;

        const query = {
            ...(location && {location:{$regex:location,$options:"i"}}),
            ...(minPrice && {price:{$gte:minPrice}}),
            ...(maxPrice && {price:{$lte:maxPrice}})
        }

        const properties=await Property.find(query)
        if(!properties.length==0){
            return next(new customError("no property found",400));
        }
        res.status(200).json({
            status:true,
            message:"properties fechted successfully",
            data:properties
        })
        
    } catch (error) {
        return next(new customError(error.message,500));
    }
}



module.exports={
    createProperty,
    viewProperty,
    updateProperty,
    deleteProperty, 
    searchProperty
}