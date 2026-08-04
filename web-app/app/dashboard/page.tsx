import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDashboardData } from "../lib/dashboard";
import { WeeklyAttendanceChart } from "@/components/dashboard/weekly-attendance-chart";

export default async function PrincipalDashboard({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string; sectionId?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  const cookieStore = await cookies();
  const schoolIdCookie = cookieStore.get('schoolId')?.value;

  if (!schoolIdCookie) {
    redirect('/select-school');
  }

  const schoolId = Number(schoolIdCookie);
  const classId = resolvedSearchParams.classId ? Number(resolvedSearchParams.classId) : undefined;
  const sectionId = resolvedSearchParams.sectionId ? Number(resolvedSearchParams.sectionId) : undefined;

  const data = await getDashboardData(schoolId, classId, sectionId);

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
      {/* Greeting */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Hi, John! 👋</h1>
        <p className="text-sm text-gray-500">Here's a quick overview of your day</p>
      </div>

      {/* Top row: Fee Collection + Student Strength + Teachers Present */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fee Collection Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">School Fee Collection Status</h3>
            <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {data.fee.academicYear ?? "This Year"}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{data.fee.collectionPercent}%</p>
          <div className="w-full h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${data.fee.collectionPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Fee Collected: ₹{(data.fee.collected / 100000).toFixed(2)}L
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Overdue: ₹{(data.fee.overdue / 100000).toFixed(2)}L
            </span>
          </div>
        </div>

        {/* Overall Student Strength */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Overall Student Strength</h3>
          <p className="text-3xl font-bold text-gray-900">{data.students.total}</p>
          <p className="text-xs text-gray-400 mt-2">
            {data.students.boys ?? "—"} boys, {data.students.girls ?? "—"} girls
          </p>
        </div>

        {/* Teachers Present */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Teachers Present</h3>
          <p className="text-3xl font-bold text-gray-900">
            {data.teachers.present}
            <span className="text-base text-gray-400"> / {data.teachers.total}</span>
          </p>
        </div>
      </div>

      {/* Second row: No. of Events + Current Fee — NOT backed by schema yet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-5 opacity-60">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">No. of Events</h3>
          <p className="text-3xl font-bold text-gray-400">—</p>
          <p className="text-xs text-gray-400 mt-2">No Event data source yet</p>
        </div>
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-5 opacity-60">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Current Fee</h3>
          <p className="text-3xl font-bold text-gray-400">—</p>
          <p className="text-xs text-gray-400 mt-2">No fee-type breakdown modeled yet</p>
        </div>
      </div>

      {/* Present / Absent / Leave */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700">Present</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">{data.students.presentPercent}%</p>
          <p className="text-xs text-gray-400 mt-1">{data.students.present} Students</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700">Absent</h3>
          <p className="text-2xl font-bold text-red-500 mt-1">{data.students.absentPercent}%</p>
          <p className="text-xs text-gray-400 mt-1">{data.students.absent} Students</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700">Leave</h3>
          <p className="text-2xl font-bold text-yellow-500 mt-1">{data.students.leavePercent}%</p>
          <p className="text-xs text-gray-400 mt-1">{data.students.leave} Students</p>
        </div>
      </div>

      {/* Weekly Attendance Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Students Attendance Status</h3>
        <WeeklyAttendanceChart data={data.weeklyChart} />
      </div>

      {/* Today's Events + App Usage — NOT backed by schema yet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-5 opacity-60">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Today's Events</h3>
          <p className="text-xs text-gray-400">No Event data source yet</p>
        </div>
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-5 opacity-60">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">App Usage</h3>
          <p className="text-xs text-gray-400">No usage analytics source yet</p>
        </div>
      </div>
    </div>
  );
}