import { AppLayout } from '@/components/layout/app-layout';
import { redirect } from 'next/navigation';

export default function RecruitmentPage() {
    // Redirect to the first sub-page
    redirect('/recruitment/requisitions');

    return (
        <AppLayout>
            <div className="space-y-6">
                <div>
                <h1 className="text-3xl font-bold font-headline">Recruitment</h1>
                <p className="text-muted-foreground">
                    Manage your recruitment and intake lifecycle.
                </p>
                </div>
            </div>
        </AppLayout>
    );
}
