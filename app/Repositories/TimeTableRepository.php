<?php

namespace App\Repositories;

use App\Models\TimeTable;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class TimeTableRepository
{
    /**
     * @var TimeTable
     */
    protected $timetable;

    /**
     * @param TimeTable $timetable
     */
    public function __construct(TimeTable $timetable)
    {
        $this->timetable = $timetable;
    }

    /**
     * find dates by range
     *
     * @param Carbon $start
     * @param Carbon $end
     *
     * @return Collection
     */
    public function findByRange(Carbon $start, Carbon $end)
    {
        $start->setTime(0, 0, 0);
        $end->setTime(24, 56, 56);

        return $this->timetable
            ->whereBetween('date', [$start, $end])
            ->get();
    }

    /**
     * @param Carbon $date
     * @param string $field
     * @param $value
     *
     * @return null
     */
    public function update(Carbon $date, $field, $value)
    {
        $this->updateFromArray($date, [
            $field => $value
        ]);
    }

    /**
     * @param Carbon $start
     * @param Carbon $end
     * @param        $changePriceTo
     * @param        $changeAvailibilityTo
     * @param        $roomType
     * @param        $daysOfWeek
     */
    public function bulkUpdate(
        Carbon $start,
        Carbon $end,
        $changePriceTo,
        $changeAvailibilityTo,
        $roomType,
        $daysOfWeek
    ) {
        $start->setTime(0, 0, 0);
        $end->setTime(0, 0, 0);

        $currentDate  = $start;

        while ($currentDate <= $end) {
            $dayOfWeek = $this->mapDayOfWeek($currentDate);

            if ($daysOfWeek[$dayOfWeek]) {
                $updateArray = [];
                
                if ($changeAvailibilityTo) {
                    $updateArray[$roomType . '_room_available'] = $changeAvailibilityTo;
                }
                
                if ($changePriceTo) {
                    $updateArray[$roomType . '_room_price'] = $changePriceTo;
                }

                $this->updateFromArray($currentDate, $updateArray);
            }

            $currentDate->addDay(1);
        }
    }

    /**
     * @param Carbon $date
     * @param        $fields
     *
     * @return null
     */
    protected function updateFromArray(Carbon $date, $fields)
    {
        if (!$fields) {
            return;
        }

        $date->setTime(0, 0, 0);

        $timetableBuilder = $this->timetable->where('date', $date);

        // check if date has already a reserved row in db
        if ($timetableBuilder->count() > 0) {
            $timetableBuilder->update($fields);

            return;
        }

        // insert the field into db
        $newTimetable = $this->timetable->newInstance();

        $newTimetable->date = $date;

        foreach ($fields as $field => $value) {
            $newTimetable->$field = $value;
        }

        $newTimetable->save();
    }

    /**
     * @param Carbon $date
     *
     * @return mixed
     */
    protected function mapDayOfWeek(Carbon $date)
    {
        $days = [
            Carbon::SUNDAY => 'sunday',
            Carbon::MONDAY => 'monday',
            Carbon::TUESDAY => 'tuesday',
            Carbon::WEDNESDAY => 'wednesday',
            Carbon::THURSDAY => 'thursday',
            Carbon::FRIDAY => 'friday',
            Carbon::SATURDAY => 'saturday',
        ];

        return $days[$date->dayOfWeek];
    }
}
