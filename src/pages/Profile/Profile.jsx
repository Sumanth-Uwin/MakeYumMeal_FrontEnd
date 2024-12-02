import React from 'react';
import { Button } from "../../components/ui/button"; // Assuming you have a button component from Shadcn UI
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"; // Assuming card components from Shadcn UI
import { Avatar } from "../../components/ui/avatar"; // Assuming avatar component for user picture
import { BookOpen } from 'lucide-react'; // Icons for the buttons
import Navbar from '../../components/Navbar/navbar';
import { useUser } from '../../UserContext'; // Importing user context
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useUser(); // Fetch user from context

  if (!user) {
    return <p>Loading...</p>; // Or any loading state until the user is available
  }
  const navigate = useNavigate();
  const handleViewRecipes = () => {
    navigate('/SavedRecipes'); // Navigate to the SavedRecipes page
  };
  const handleSavedNotes = () => {
    navigate('/SavedNotes'); // Navigate to the SavedRecipes page
  };
  return (
    <div>
      {/* Navbar */}
      <Navbar />
      
      {/* Profile Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar src={user.avatarUrl || 'https://via.placeholder.com/150'} alt="User Avatar" size="lg" />
              <div>
                <CardTitle className="text-xl font-semibold">{user.firstName + " "+ user.lastName}</CardTitle>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* No need for edit or password change buttons */}
          </CardContent>
        </Card>

        {/* Saved Notes and Recipes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Notes</CardTitle>
            </CardHeader>
            <CardContent>
            <Button variant="outline" className="w-full" onClick={handleSavedNotes}>
                <BookOpen className="mr-2" />
                View Notes 
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saved Recipes</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={handleViewRecipes}>
                <BookOpen className="mr-2" />
                View Recipes 
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
