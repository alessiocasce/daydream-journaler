
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Book } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@/types/journalTypes';

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  useEffect(() => {
    // Check if already logged in
    const user = localStorage.getItem('journal-user');
    if (user) {
      // Use setTimeout to avoid immediate navigation which can cause security errors
      setTimeout(() => {
        navigate('/journal');
      }, 0);
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const users: User[] = JSON.parse(localStorage.getItem('journal-users') || '[]');
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        localStorage.setItem('journal-user', JSON.stringify({ id: user.id, username: user.username }));
        toast.success('Logged in successfully!');
        
        // Use setTimeout to avoid immediate navigation which can cause security errors
        setTimeout(() => {
          navigate('/journal');
        }, 0);
      } else {
        toast.error('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!registerUsername.trim() || !registerPassword.trim()) {
        toast.error('Username and password are required');
        setIsLoading(false);
        return;
      }

      const users: User[] = JSON.parse(localStorage.getItem('journal-users') || '[]');
      
      if (users.some(u => u.username === registerUsername)) {
        toast.error('Username already taken');
        setIsLoading(false);
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        username: registerUsername,
        password: registerPassword
      };

      users.push(newUser);
      localStorage.setItem('journal-users', JSON.stringify(users));
      
      // Auto login after registration
      localStorage.setItem('journal-user', JSON.stringify({ id: newUser.id, username: newUser.username }));
      
      toast.success('Registration successful!');
      
      // Use setTimeout to avoid immediate navigation which can cause security errors
      setTimeout(() => {
        navigate('/journal');
      }, 0);
    } catch (error) {
      console.error('Register error:', error);
      toast.error('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-journal-light-purple to-journal-soft-blue">
      <div className="max-w-md w-full p-4">
        <div className="mb-6 text-center">
          <div className="mb-4 mx-auto w-16 h-16 bg-journal-purple rounded-full flex items-center justify-center">
            <Book className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-journal-purple">Daydream Journal</h1>
          <p className="text-gray-700">Your personal daily reflection space</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your journal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Input
                      id="username"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-journal-purple hover:bg-journal-dark-purple" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Input
                      id="register-username"
                      placeholder="Choose a username"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Choose a password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-journal-purple hover:bg-journal-dark-purple" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Register"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="mt-2 text-xs text-center text-gray-500">
              Your journal entries are stored locally in this browser
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
