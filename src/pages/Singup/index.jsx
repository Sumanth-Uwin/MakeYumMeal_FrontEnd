import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card } from "../../components/ui/card"
import png2 from '../../images/image (4).png'

const Signup = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:3100/api/users";
      const { data: res } = await axios.post(url, data);
      navigate("/login");
      console.log(res.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-4xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Image */}
          <div className="md:w-1/2">
            <img
              src={png2}
              alt="Cooking"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Right side - Form */}
          <div className="md:w-1/2 p-8 bg-white">
            <div className="max-w-md mx-auto">
              <h1 className="text-2xl font-bold text-center mb-8">
                Create Account
              </h1>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={data.firstName}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={data.lastName}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={data.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={data.password}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-500 text-center">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  Sign Up
                </Button>

                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-orange-500 hover:text-orange-600">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Signup;