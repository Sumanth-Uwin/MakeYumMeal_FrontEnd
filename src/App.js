
import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./pages/Main";
import Signup from "./pages/Singup";
import Login from "./pages/Login";
import RecipeDetail from "./pages/RecipeDetails/RecipeDetail"
import SearchRecipes from "./pages/SearchRecipes/SearchRecipes"


import CategoryPage from './pages/category/CategoryPage.jsx';

function App() {
	const user = localStorage.getItem("token");
	

	return (
		<Routes>
			{user && <Route path="/" exact element={<Main/>} />}
			<Route path="home" exact element={<Main/>} />
			<Route path="/signup" exact element={<Signup/>} />
			<Route path="/login" exact element={<Login/>} />
			<Route path="/search" exact element={<SearchRecipes/>} />
			<Route path="/" element={<Navigate replace to="/login" />} />
			<Route path="/recipe/:id" element={<RecipeDetail />} />
			<Route path="categories/:category" exact element={<CategoryPage/>}/>
		</Routes>
	);
}

export default App;
