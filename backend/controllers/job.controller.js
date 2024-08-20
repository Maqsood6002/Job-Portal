import { Job } from '../models/job.model.js';
export const postJob = async (req, res) => {
    try {
        const { title, description, requirement, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;
        if (!title || !description || !requirement || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Please fill all the fields",
                success: false
            })
        }
        const job = await Job.create({
            title,
            description,
            requirement: requirement.split(","),
            salary: Number(salary),
            location,
            jobType,
            experience,
            position,
            company: companyId,
            createdBy: userId
        })
        res.status(201).json({
            message: "Job posted successfully",
            success: true,
            job
        })
    } catch (error) {
        console.log(error);
    }
}
export const getAllJobs = async (req, res)=>{
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex:keyword, $options: "i" } },
                { description: { $regex:keyword, $options: "i" } }
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({createdAt:-1});
        if (!jobs) {
            return res.status(404).json({
                message: "No jobs found",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const getJobById = async(req, res)=> {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"application"
        });
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        return res.status(200).json({
            job,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

//admin created jobs
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
