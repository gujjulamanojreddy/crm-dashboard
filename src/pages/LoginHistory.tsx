import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell, TablePagination } from '../components/ui/Table';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface LoginHistoryEntry {
  id: string;
  user_id: string;
  email: string;
  ip_address: string;
  user_agent: string;
  login_timestamp: string;
  login_status: string;
}

const LoginHistory = () => {
  const [history, setHistory] = useState<LoginHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  useEffect(() => {
    fetchLoginHistory();
  }, []);

  const fetchLoginHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('login_history')
        .select('*')
        .order('login_timestamp', { ascending: false });

      if (error) throw error;

      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching login history:', error);
      toast.error('Failed to load login history');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(history.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedHistory = history.slice(startIndex, startIndex + entriesPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Login History</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Login Time</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>IP Address</TableHeader>
                  <TableHeader>Browser</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading history...
                    </TableCell>
                  </TableRow>
                ) : paginatedHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No login history found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedHistory.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{formatDate(entry.login_timestamp)}</TableCell>
                      <TableCell>{entry.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          entry.login_status === 'success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {entry.login_status === 'success' ? 'Success' : 'Failed'}
                        </span>
                      </TableCell>
                      <TableCell>{entry.ip_address}</TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600 truncate block max-w-xs">
                          {entry.user_agent}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {paginatedHistory.length > 0 && (
            <div className="mt-4">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginHistory;