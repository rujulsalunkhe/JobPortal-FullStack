import React from 'react';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const Job = ({ job }) => {
    const navigate = useNavigate();

    const daysAgoFunction = (mongodbTime) => {
        if (!mongodbTime) return 'Unknown'; // Handle undefined dates
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Calculates days difference accurately
    };

    return (
        <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
                </p>
                <Button variant="outline" className="rounded-full" size="icon"><Bookmark /></Button>
            </div>

            <div className="flex items-center gap-2 my-2">
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo || ''} alt={`${job?.company?.name || 'Company'} logo`} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className="font-medium text-lg">{job?.company?.name || 'Company Name'}</h1>
                    <p className="text-sm text-gray-500">India</p>
                </div>
            </div>

            <div>
                <h1 className="font-bold text-lg my-2">{job?.title || 'Job Title'}</h1>
                <p className="text-sm text-gray-600">{job?.description || 'No description available.'}</p>
            </div>
            <div className="flex items-center gap-2 mt-4">
                <Badge className="text-blue-700 font-bold" variant="ghost">
                    {job?.position ? `${job?.position} Positions` : 'N/A'}
                </Badge>
                <Badge className="text-[#F83002] font-bold" variant="ghost">
                    {job?.jobType || 'Job Type'}
                </Badge>
                <Badge className="text-[#7209b7] font-bold" variant="ghost">
                    {job?.salary ? `${job?.salary} LPA` : 'Salary Unspecified'}
                </Badge>
            </div>
            <div className="flex items-center gap-4 mt-4">
                <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline">Details</Button>
                <Button className="bg-[#7209b7]">Save For Later</Button>
            </div>
        </div>
    );
};

export default Job;
