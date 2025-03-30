
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, ThumbsDown, Calendar, Clock, Award, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Scholarship } from "@/types/dao";

interface ScholarshipCardProps {
  scholarship: Scholarship;
  showActions?: boolean;
  isApplied?: boolean;
}

export function ScholarshipCard({ 
  scholarship, 
  showActions = true,
  isApplied = false
}: ScholarshipCardProps) {
  const {
    id,
    title,
    description,
    amount,
    creator_address,
    recipient,
    status,
    votes,
    created_at,
    deadline,
    voters,
    applicants,
  } = scholarship;

  const totalVotes = votes.for + votes.against;
  const votesFor = totalVotes > 0 ? (votes.for / totalVotes) * 100 : 0;
  
  const timeLeft = deadline > Date.now() 
    ? formatDistanceToNow(deadline, { addSuffix: true })
    : 'Deadline passed';

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-edu-light pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-edu-dark">{title}</CardTitle>
          <div className="rounded-full bg-edu-primary/10 text-edu-primary px-3 py-1 text-sm font-medium">
            {amount} EDU
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
          <User className="h-3 w-3" />
          <span>Created by {creator_address.substring(0, 6)}...{creator_address.substring(creator_address.length - 4)}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <p className="text-gray-700 mb-4">{description}</p>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <div className="flex items-center">
                <ThumbsUp className="h-4 w-4 text-green-500 mr-1" />
                <span>{votes.for} votes for</span>
              </div>
              <div className="flex items-center">
                <span>{votes.against} votes against</span>
                <ThumbsDown className="h-4 w-4 text-red-500 ml-1" />
              </div>
            </div>
            <Progress value={votesFor} className="h-2" />
          </div>
          
          <div className="flex flex-wrap justify-between text-sm text-gray-500 gap-y-2">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Created {formatDistanceToNow(created_at, { addSuffix: true })}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{timeLeft}</span>
            </div>
          </div>
          
          {applicants.length > 0 && (
            <div className="mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                {applicants.length} {applicants.length === 1 ? 'application' : 'applications'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter className="border-t bg-gray-50 gap-2 flex-wrap">
          <div className="w-full text-center text-sm text-gray-500">
            {status !== 'pending' 
              ? `This scholarship is ${status}` 
              : deadline <= Date.now() 
                ? "Voting period has ended"
                : "Scholarship is pending"}
          </div>
          
          {isApplied && (
            <div className="w-full flex justify-center">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Application submitted
              </div>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
