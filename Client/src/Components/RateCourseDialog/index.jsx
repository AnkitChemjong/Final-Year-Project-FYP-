import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { UseContextApi } from '../ContextApi';
import { FiLoader } from "react-icons/fi";
import { axiosService } from '@/Services';
import { Rate_Course } from '@/Routes';
import { getSingleRateData } from '@/Pages/CourseProgress';
import { useDispatch } from 'react-redux';
import { getAllRating } from '@/Store/Slices/Get_All_Rating';

export function RateCourseDialog({ 
  courseId,
  userId,
  open,
  onOpenChange
}) {
    const dispatch=useDispatch();
  const [hover, setHover] = useState(0);
  const [data, setData] = useState({
    rating: 0,  
    comment: ""
  });
  
  const { loadingSpin, setLoadingSpin,userRatingData,setUserRatingData } = useContext(UseContextApi);

  const handleSubmit = async () => {
    setLoadingSpin(true);
    try {
      const response=await axiosService.post(`${Rate_Course}/${userId}/${courseId}`,data);
      if(response?.status===200){
          toast.success(response?.data?.message);
          const result=await getSingleRateData(userId,courseId);
          setUserRatingData(result);
          dispatch(getAllRating());
          onOpenChange(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoadingSpin(false);
    }
  };

  
  const isSubmitDisabled = loadingSpin || data.rating === 0 || data.comment === "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]" showOverlay={false}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            How was your learning experience?
          </DialogTitle>
          <DialogDescription className="text-center">
            Your feedback helps us improve
          </DialogDescription>
        </DialogHeader>

       
        <div className="flex justify-center my-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="text-3xl mx-1 focus:outline-none"
              onClick={() => setData(prev => ({...prev, rating: star }))}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              {star <= (hover || data.rating) ? (
                <FaStar className="text-yellow-400" />
              ) : (
                <FaRegStar className="text-yellow-400" />
              )}
            </button>
          ))}
        </div>

    
        <div className="mt-4">
          <label htmlFor="feedback" className="block text-sm font-medium mb-2">
            Leave some comment
          </label>
          <textarea
            id="feedback"
            rows={3}
            className="w-full p-2 border rounded-md text-sm"
            placeholder="What did you like? How can we improve?"
            value={data.comment}
            onChange={(e) => setData(prev => ({...prev, comment: e.target.value }))}
          />
        </div>

     
        <div className="mt-6 flex justify-end gap-2">
          <Button 
          className="flex items-center gap-2 border-2 border-black text-black bg-gray-200 hover:bg-gray-600 transition-all ease-in-out hover:scale-105" 
            onClick={() => onOpenChange(false)}
          >
            Later
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="flex items-center gap-2 bg-green-600 hover:bg-blue-600 transition-all ease-in-out hover:scale-105"
          >
            {loadingSpin && <FiLoader className="w-4 h-4 animate-spin" />}
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}