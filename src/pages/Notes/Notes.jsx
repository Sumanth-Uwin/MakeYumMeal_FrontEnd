import React, { useState } from 'react';
import { Button } from "../../components/ui/button";
import { Modal } from "../../components/ui/modal"; // Assuming you have a Modal component

const Notes = ({ isOpen, onClose, recipeId, onSave }) => {
  const [note, setNote] = useState('');

  const handleSave = () => {
    onSave(recipeId, note);
    setNote('');  // Clear the note input
    onClose();  // Close the modal after saving
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-semibold">Add Notes</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full h-32 p-2 border rounded-lg mt-4"
          placeholder="Write your notes here..."
        />
        <div className="flex gap-4 mt-4">
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default Notes;
