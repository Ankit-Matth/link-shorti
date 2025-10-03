import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import { signIn } from '@/auth';
import User from '@/models/Users';
import Statistics from '@/models/Statistics';
import Withdrawal from '@/models/Withdrawal';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    connectDB();

    if (name) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "Email already exists" },
          { status: 400 }
        );
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        fullName: name,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      const newStatistics = new Statistics({
        userEmail: email,
      });
      await newStatistics.save();

      const newWithdrawal = new Withdrawal({
        userEmail: email,
      });
      await newWithdrawal.save();
      
      return NextResponse.json(
        { success: true, message: "User created successfully." },
        { status: 201 }
      );
    } 
    else {
      const user = await User.findOne({ email });

      if (!user) {
        return NextResponse.json(
          { success: false, message: "Invalid email or password" },
          { status: 401 }
        );
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (!isPasswordMatched) {
        return NextResponse.json(
          { success: false, message: "Invalid email or password" },
          { status: 401 }
        );
      }
      
      await signIn("credentials", {
        user: JSON.stringify(user),
        redirect: false,
      });

      return NextResponse.json(
        { success: true, message: "Login successful" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}