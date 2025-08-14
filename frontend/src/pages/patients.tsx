import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import Header from '@/components/layout/admin-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { RecoveryBadge } from '@/components/ui/recovery-badge';
import { AddPatientForm } from '@/components/patients/add-patient-form-v2';
import { Filter, Plus, Search } from 'lucide-react';
import { getAge, getFullName, formatDate, getDaysAgo } from '@/lib/utils';

import { usePatientsData } from '@/config/apiQueries';


// // INTEGRATE WITH BACKEND API
// import { apiRequest } from '@/lib/queryClient';


// async function fetchPatientsWithRisk(integrated_api: boolean): Promise<PatientWithRisk[]> {
//   const res = await apiRequest("GET", "/patients/with-risk", undefined, integrated_api);
//   return res.json();
// }

// // 
import { DefaultError, QueryKey, QueryClient, NoInfer } from '@tanstack/query-core';
import { DefinedUseQueryResult, UseQueryResult, UseQueryOptions } from '@tanstack/react-query';
import { DefinedInitialDataOptions, UndefinedInitialDataOptions } from '@tanstack/react-query';
import { usePatient } from '@/hooks/usePatient';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { fetchPatients } from '@/features/patientSlice';





export default function Patients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // Fetch patients with risk scores
  // const {
  //   data: patients,
  //   isLoading,
  //   error
  // } = useQuery<PatientWithRisk[]>({
  //   queryKey: ['/api/patients/with-risk'],
  // });

  // const {
  //   data: patients,
  //   isLoading,
  //   error,
  // } = useQuery<PatientWithRisk[]>({
  //   queryKey: ['/api/fw/patients/with-risk'],
  // });
  // const {
  //   data: patients,
  //   isLoading,
  //   error,
  // } = useQuery<PatientWithRisk[]>({
  //   queryKey: ['/api/v2/patients'],
  // });


  // const { patients, patientsLoading, patientsError } = usePatientsData();

  // const isLoading = patientsLoading;
  // const error = patientsError;

  // Filter patients based on search term

  // const displayPatients = [
  //   {
  //     id: 1,
  //     firstName: "Michael",
  //     lastName: "Thompson",
  //     dateOfBirth: "1990-01-01",
  //     gender: "Male",
  //     riskLevel: "critical",
  //     lastCheckin: {
  //       pcssTotal: 100,
  //     },
  //     schoolOrTeam:"Westlake High School",
  //     concussion:{
  //       sportActivity: "Basketball",
  //       dateOfInjury: "2025-07-22",
  //     },
  //   },
  //   {
  //     id: 2,
  //     firstName: "Emma",
  //     lastName: "Rodriguez",
  //     dateOfBirth: "1990-01-01",
  //     gender: "Male",
  //     riskLevel: "recovering",
  //     lastCheckin: {
  //       pcssTotal: 100,
  //     },
  //     schoolOrTeam:"Westlake High School",
  //     concussion:{
  //       sportActivity: "Basketball",
  //       dateOfInjury: "2025-07-25",
  //     },
  //   },
  //   {
  //     id: 3,
  //     firstName: "James",
  //     lastName: "Wilson",
  //     dateOfBirth: "1990-01-01",
  //     gender: "Male",
  //     riskLevel: "stable",
  //     lastCheckin: {
  //       pcssTotal: 100,
  //     },
  //     concussion:{
  //       sportActivity: "Basketball",
  //       dateOfInjury: "2025-07-28",
  //     },
  //     schoolOrTeam:"Westlake High School",
  //   },
  // ];
  

  // const filteredPatients = displayPatients?.filter(patient => {
  //   const fullName = getFullName(patient.firstName, patient.lastName).toLowerCase();
  //   return fullName.includes(searchTerm.toLowerCase()) ||
  //     (patient.schoolOrTeam && patient.schoolOrTeam.toLowerCase().includes(searchTerm.toLowerCase()));
  // });
  useEffect(()=>{
    dispatch(fetchPatients());
  }, [dispatch]);

  const { patients, loading, error } = usePatient();
  
  const patientsData = patients.users?.slice().reverse();


  // Define columns for the data table
  const columns = [
    {
      header: 'Status',
      accessorKey: 'riskLevel',
      cell: ({ row }: any) => <RecoveryBadge status={row.original.riskLevel} />
    },
    {
      header: 'Patient',
      accessorKey: 'name',
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium">{getFullName(row.original.firstName, row.original.lastName)}</div>
          {/* <div className="font-medium">{row.original)}</div> */}
          <div className="text-neutral-400 text-sm">{getAge(row.original.dateOfBirth)} • {row.original.gender}</div>
        </div>
      )
    },
    {
      header: 'School/Team',
      accessorKey: 'schoolOrTeam',
      cell: ({ row }: any) => <span>{row.original.schoolOrTeam || '-'}</span>
    },
    {
      header: 'Injury Type',
      accessorKey: 'injuryType',
      cell: ({ row }: any) => <span>{row.original.concussion?.sportActivity} Concussion</span>
    },
    {
      header: 'Date of Injury',
      accessorKey: 'dateOfInjury',
      cell: ({ row }: any) => (
        <div>
          <div>{formatDate(row.original.concussion?.dateOfInjury || '')}</div>
          <div className="text-neutral-400 text-sm">{getDaysAgo(row.original.concussion?.dateOfInjury || '')}</div>
        </div>
      )
    },
    {
      header: 'PCSS Score',
      accessorKey: 'pcssScore',
      cell: ({ row }: any) => (
        <div className={`font-bold ${row.original.lastCheckin?.pcssTotal > 60 ? 'text-status-red' :
          row.original.lastCheckin?.pcssTotal > 30 ? 'text-status-yellow' :
            'text-status-green'
          }`}>
          {row.original.lastCheckin?.pcssTotal || '-'}
        </div>
      )
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }: any) => (
        <Link href={`/admin/patients/${row.original._id}`}>
          <Button>View Details</Button>
        </Link>
      )
    }
  ];

  // Update document title
  useEffect(() => {
    document.title = "Patients | Spinal Health OS";
  }, []);

  return (
    <div className="p-4 md:p-6">
      <Header title="Patients" />

      <Card className="bg-neutral-900 border-neutral-800 mb-6">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <CardTitle>Patient Management</CardTitle>
          <div className="flex space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
              <Input
                type="search"
                placeholder="Search patients..."
                className="pl-8 bg-neutral-800 border-neutral-700 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0 border-none bg-neutral-800 text-white hover:bg-[#cde4da] hover:text-[#164630]" > 
              <Filter className="h-4 w-4" />
            </Button>
            <Button 
              className="shrink-0"
              onClick={() => setShowAddPatientForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-neutral-400">Loading patients...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Error loading patients: {error instanceof Error ? error.message : String(error)}
            </div>
          ) : patientsData && patientsData.length > 0 ? (
            <DataTable columns={columns} data={patientsData} />
          ) : (
            <div className="text-center py-8 text-neutral-400">
              {searchTerm ? 'No patients match your search' : 'No patients available'}
            </div>
          )}
           {/* <DataTable columns={columns} data={patientsData} /> */}
        </CardContent>
      </Card>

      <AddPatientForm 
        open={showAddPatientForm} 
        onOpenChange={setShowAddPatientForm} 
      />
    </div>
  );
}
