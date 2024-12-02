import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { FileTextIcon, TrashIcon } from 'lucide-react';
import { useUser } from '../../UserContext';
import Navbar from '../../components/Navbar/navbar';
import Footer from "../../components/Footer/Footer";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useUser(); // Get user from context
  const loggedInUserId = user?.userId; // Get logged-in user ID

  // Fetch all notes for the logged-in user
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`http://localhost:3100/api/notes/${loggedInUserId}`);
        setNotes(response.data); // Assuming response.data contains the notes

      } catch (error) {
        console.error("Error fetching notes:", error);
        setError("Unable to fetch notes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (loggedInUserId) {
      fetchNotes();
    }
  }, [loggedInUserId]);

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await axios.delete(`http://localhost:3100/api/notes/${noteId}`);
      if (response.status === 200) {
        setNotes(notes.filter(note => note._id !== noteId)); // Remove deleted note from the list
        alert("Note deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note. Please try again.");
    }
  };

  if (loading) return <p>Loading notes...</p>;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Notes</h1>

        {/* Show message if no notes are available */}
        {notes.length === 0 ? (
          <p className="text-lg text-gray-500">No notes saved.</p>
        ) : (
          <div className="space-y-6">
            {notes.map((note) => (
              <Card key={note._id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{note.title}</h2>
                    <p className="text-gray-600">{note.content}</p>
                  </div>
                  <Button
                    variant="destructive"
                    className="flex items-center gap-2"
                    onClick={() => handleDeleteNote(note._id)}
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default NotesPage;
