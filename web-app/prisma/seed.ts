import { Gender, AttendanceStatus } from '@prisma/client';
import { subDays } from 'date-fns';
import { prisma } from '../app/lib/prisma';

async function main() {
  console.log('Clearing existing data...');
  // Delete in FK-dependency order
  await prisma.studentAttendance.deleteMany();
  await prisma.teacherAttendance.deleteMany();
  await prisma.feeRecord.deleteMany();
  await prisma.event.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.userSchool.deleteMany();
  await prisma.section.deleteMany();
  await prisma.class.deleteMany();
  await prisma.user.deleteMany();
  await prisma.school.deleteMany();

  console.log('Creating school...');
  const school = await prisma.school.create({
    data: { name: 'Nirmala School', address: 'Muvattupuzha, Kerala' },
  });

  console.log('Creating classes and sections...');
  const class5 = await prisma.class.create({
    data: { schoolId: school.id, name: 'Class 5' },
  });
  const section5A = await prisma.section.create({
    data: { classId: class5.id, name: 'A' },
  });

  const class6 = await prisma.class.create({
    data: { schoolId: school.id, name: 'Class 6' },
  });
  const section6A = await prisma.section.create({
    data: { classId: class6.id, name: 'A' },
  });

  console.log('Creating admin user...');
  const adminUser = await prisma.user.create({
    data: {
      name: 'John Jude',
      password: 'changeme123', // plaintext for now — see auth notes
      designation: 'Principal',
      roles: ['Admin'],
      mobile: '9876543210',
      status: 'Active',
    },
  });
  await prisma.userSchool.create({
    data: { userId: adminUser.id, schoolId: school.id },
  });

  console.log('Creating students...');
  const studentSeeds = [
    { name: 'Aarav Menon', mobile: '9000000001', gender: Gender.MALE, classId: class5.id, sectionId: section5A.id },
    { name: 'Diya Nair', mobile: '9000000002', gender: Gender.FEMALE, classId: class5.id, sectionId: section5A.id },
    { name: 'Kabir Pillai', mobile: '9000000003', gender: Gender.MALE, classId: class6.id, sectionId: section6A.id },
  ];

  const students = [];
  for (const s of studentSeeds) {
    const user = await prisma.user.create({
      data: {
        name: s.name,
        password: 'changeme123',
        designation: 'Student',
        roles: ['Student'],
        mobile: s.mobile,
        status: 'Active',
      },
    });
    const student = await prisma.student.create({
      data: {
        userId: user.id,
        dob: new Date('2015-06-01'),
        gender: s.gender,
        guardian: `${s.name.split(' ')[0]}'s Parent`,
        classId: s.classId,
        sectionId: s.sectionId,
      },
    });
    students.push(student);
  }

  console.log('Creating teachers...');
  const teacherSeeds = [
    { name: 'Priya Varma', mobile: '9100000001', department: 'Mathematics', subjects: ['Math', 'Science'] },
    { name: 'Rahul Iyer', mobile: '9100000002', department: 'English', subjects: ['English'] },
    { name: 'Sneha George', mobile: '9100000003', department: 'Social Studies', subjects: ['History', 'Geography'] },
  ];

  const teachers = [];
  for (const t of teacherSeeds) {
    const user = await prisma.user.create({
      data: {
        name: t.name,
        password: 'changeme123',
        designation: 'Teacher',
        roles: ['Teacher'],
        mobile: t.mobile,
        status: 'Active',
      },
    });
    const teacher = await prisma.teacher.create({
      data: {
        userId: user.id,
        schoolId: school.id,
        department: t.department,
        subjects: t.subjects,
        hireDate: new Date('2020-06-01'),
      },
    });
    teachers.push(teacher);
  }

  console.log('Creating fee records...');
  for (const [i, student] of students.entries()) {
    await prisma.feeRecord.create({
      data: {
        studentId: student.id,
        academicYear: '2025-26',
        totalFee: 10000,
        collected: 5000 + i * 1000,
        overdue: 5000 - i * 1000,
      },
    });
  }

  console.log('Creating a week of attendance...');
  const today = new Date();
  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const date = subDays(today, dayOffset);
    date.setUTCHours(0, 0, 0, 0);

    for (const student of students) {
      const isPresent = Math.random() > 0.15; // ~85% attendance rate
      await prisma.studentAttendance.create({
        data: {
          studentId: student.id,
          date,
          status: isPresent ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT,
          classId: student.classId,
          sectionId: student.sectionId,
        },
      });
    }

    for (const teacher of teachers) {
      const isPresent = Math.random() > 0.1; // ~90% attendance rate
      await prisma.teacherAttendance.create({
        data: {
          teacherId: teacher.id,
          date,
          status: isPresent ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT,
        },
      });
    }
  }

  console.log('Creating events...');
  await prisma.event.create({
    data: {
      schoolId: school.id,
      title: 'Annual Sports Day',
      description: 'School-wide sports event',
      date: today,
      classRange: 'Class 1-10',
    },
  });
  await prisma.event.create({
    data: {
      schoolId: school.id,
      title: 'Science Exhibition',
      description: 'Student science projects showcase',
      date: subDays(today, -2),
      classRange: 'Class 5-10',
    },
  });

  console.log('Seed complete.');
  console.log(`Admin login — mobile: 9876543210, password: changeme123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });