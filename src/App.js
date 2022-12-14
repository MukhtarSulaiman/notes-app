/** @format */

import React from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
// import { data } from'./data';
import Split from 'react-split';
import { nanoid } from 'nanoid';

export default function App() {

	const [notes, setNotes] = React.useState(
		() => JSON.parse(localStorage.getItem('notes')) || []
	);
	const [currentNoteId, setCurrentNoteId] = React.useState(
		(notes[0] && notes[0].id) || ''
	);
	
	React.useEffect(() => {
		localStorage.setItem('notes', JSON.stringify(notes));
	}, [notes])

	function createNewNote() {
		const newNote = {
			id: nanoid(),
			body: "# Type your markdown note's title here",
		};
		setNotes((prevNotes) => [newNote, ...prevNotes]);
		setCurrentNoteId(newNote.id);
	}

	function updateNote(text) {
		// This puts the the recent modified note to the top!
		setNotes((oldNotes) => {
			const arrayNotes = [];
			for (let i = 0; i < oldNotes.length; i++) {
				if (oldNotes[i].id === currentNoteId) {
					arrayNotes.unshift({ ...oldNotes[i], body: text })
				} else {
					arrayNotes.push(oldNotes[i])
				}
			}
			return arrayNotes
		});

		// This not reorganize the most recent modified note
		// setNotes((oldNotes) =>
		// 	oldNotes.map((oldNote) => {
		// 		return oldNote.id === currentNoteId
		// 			? { ...oldNote, body: text }
		// 			: oldNote;
		// 	})
		// );
	}

	 function deleteNote(event, noteId) {
		event.stopPropagation();
		 setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId))
	}

	function findCurrentNote() {
		return (
			notes.find((note) => {
				return note.id === currentNoteId;
			}) || notes[0]
		);
	}

	return (
		<main>
			{notes.length > 0 ? (
				<Split
					sizes={[30, 70]}
					direction='horizontal'
					className='split'
				>
					<Sidebar
						notes={notes}
						currentNote={findCurrentNote()}
						setCurrentNoteId={setCurrentNoteId}
						newNote={createNewNote}
						handleDeleteNote={deleteNote}
					/>
					{currentNoteId && notes.length > 0 && (
						<Editor
							currentNote={findCurrentNote()}
							updateNote={updateNote}
						/>
					)}
				</Split>
			) : (
				<div className='no-notes'>
					<h1>You have no notes</h1>
					<button className='first-note' onClick={createNewNote}>
						Create one now
					</button>
				</div>
			)}
		</main>
	);
}
