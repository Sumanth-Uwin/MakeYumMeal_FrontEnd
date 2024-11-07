import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card } from "../../components/ui/card"
import png1 from '../../images/image (2).png';

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:3100/api/auth";
      const { data: res } = await axios.post(url, data);
      localStorage.setItem("token", res.data);
      window.location = "/";
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
              src={png1}
              alt="Cooking"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Right side - Form */}
          <div className="md:w-1/2 p-8 bg-white">
            <div className="max-w-md mx-auto">
              <h1 className="text-2xl font-bold text-center mb-8">
                Welcome to MakeYumMeal
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your username"
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

                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-orange-500 hover:text-orange-600 text-sm"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  Login
                </Button>

                <div className="text-center">
                  <Link to="/signup">
                    <Button
                      variant="outline"
                      className="w-full mt-2"
                    >
                      Create Account
                    </Button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;