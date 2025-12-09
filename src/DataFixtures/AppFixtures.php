<?php

namespace App\DataFixtures;

use App\Story\DefaultCategoriesStory;
use App\Story\DefaultTasksStory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        DefaultCategoriesStory::load();
        DefaultTasksStory::load();
    }
}
