import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { PatientWithRisk } from '@/types';
import Header from '@/components/layout/admin-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { RecoveryBadge } from '@/components/ui/recovery-badge';
import { Filter, Plus, Search, Eye, Link as LinkIcon } from 'lucide-react';
import { getAge, getFullName, formatDate, getDaysAgo } from '@/lib/utils';

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  // Fetch patients with risk scores
  const {
    data: patients,
    isLoading,
    error
  } = useQuery<PatientWithRisk[]>({
    queryKey: ['/api/patients/with-risk']
  });

  // Filter patients based on search term
  const filteredPatients = patients?.filter(patient => {
    const fullName = getFullName(patient.firstName, patient.lastName).toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
      (patient.schoolOrTeam && patient.schoolOrTeam.toLowerCase().includes(searchTerm.toLowerCase()));
  });

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
        <div>
          <Link href={`/patients/${row.original.id}`}>
            <Button variant="outline" size="icon" className="shrink-0">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => {
              const link = `/patients/${row.original.id}`;
              navigator.clipboard.writeText(link).then(() => {
                setNotification(`${link} link copied to clipboard`);
                setShowNotification(true);
                setTimeout(() => {
                  setShowNotification(false);
                }, 10000); // Hide after 10 seconds
              });
            }}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>
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
                className="pl-8 bg-neutral-800 border-neutral-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
            <Button className="shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-neutral-400">Loading patients...</div>
          ) : error ? (
            <div className="text-center py-8 text-status-red">
              Error loading patients: {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          ) : filteredPatients && filteredPatients.length > 0 ? (
            <DataTable columns={columns} data={filteredPatients} />
          ) : (
            <div className="text-center py-8 text-neutral-400">
              {searchTerm ? 'No patients match your search' : 'No patients available'}
            </div>
          )}
        </CardContent>
      </Card>

      {showNotification && (
        <div className="fixed bottom-0 left-0 right-0 bg-green-500 text-white p-4 text-center">
          {notification}
        </div>
      )}
    </div>
  );
}
